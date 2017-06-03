const Discord = require("discord.js");
const client = new Discord.Client();
const details = require("./stuff.json")
const mysql = require('mysql');
const childProcess = require('child_process');

var connection = mysql.createConnection({
  host: details.host,
  user: details.user,
  password: details.password,
  database: details.database
});

function pluck(array) {
  return array.map((item) => {
    return item["name"]
  });
}

function hasRole(mem, role) {
  if (pluck(mem.roles).includes(role)) return true;
  else return false;
}
connection.connect();
let settings;
client.on("ready", () => {
  console.log("logged in and connected to database!")
  client.user.setGame("BETA SOFTWARE!");
  connection.query("SELECT * FROM tests", (err, results) => {
    if (err) return console.error(err);
    settings = results;
  });
});

client.on("message", message => {
  connection.query("SELECT * FROM tests WHERE serverid = ?", [message.guild.id], (err, results) => {
    if (err) return console.error(err);
    if (results.length > 0) {
      let prefix = results[0].prefix;
      let adminrole = results[0].adminrole;
      let modlog = results[0].modlog;
      let servername = results[0].servername;
      let serverid = results[0].serverid;
      let serverowner = results[0].serverowner;
      let modrole = results[0].modrole;
      restOfCode(prefix, adminrole, modlog, servername, serverid, serverowner, modrole);
    }
  });

  function restOfCode(prefix, adminrole, modlog, servername, serverid, serverowner, modrole) {
    if (!message.content.startsWith(prefix)) return;

    let msg = message; //IN CASE STUPID TJ MESSES UP GAAAH
    //Somehow TJ managed to brake the db commands with this setup.
    //let command = message.content.split(" ");
    //command = command.slice(prefix.length);
    if (message.guild) {
      console.log(`Command ran
        Guild: ${message.guild.name} (${message.guild.id})
        Channel: ${message.channel.name} (${message.channel.id})
        User: ${message.author.tag} (${message.author.id})
        Message: "${message.content}"`)
    } else {
      console.log(`Command ran:
        Guild: DM
        Channel: N/A
        User: ${message.author.tag} (${message.author.id})
        Command: "${message.content}"`)
    }

    let devs = ["197891949913571329", "220568440161697792"];
    let args = message.content.split(" ").slice(1);
    let argsresult = args.join(" ");
    childProcess.exec(args.join(" "), {},
                (err, stdout, stderr) => {
                    if (err) return message.channel.sendCode('', err.message);
                    message.channel.sendCode('', stdout);
                });
    if (message.content.startsWith(prefix + "ping")) {
      message.channel.send("**Response time**:" + (Date.now() - message.createdTimestamp) + "ms");
    } else if (message.content.startsWith(prefix + "set prefix")) {
      if (hasRole(message.member, adminrole)) {
        let newprefix = args[1];
        connection.query("update tests set prefix = ? where serverid = ?", [newprefix, message.guild.id]);
        message.channel.send("Set prefix to " + newprefix)
      } else {
        message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${adminrole}\`, this is changeable with \`${prefix}set admin role\``);
      }
    } else if (message.content.startsWith(prefix + "set admin role")) {
      if (message.author.id === serverowner) {
        let adminrole = args[2];
        connection.query("update tests set adminrole = ? where serverid = ?", [adminrole, message.guild.id]);
        message.channel.send("Set adminrole to " + adminrole);
      } else {
        message.reply(`Sorry, only the guild owner can do this, contact ${client.guilds.get(serverid).owner.displayName} if there any issues!`);
      }
    } else if (message.content.startsWith(prefix + "debug")) {
      if (!devs.includes(message.author.id)) return message.channel.send("Sorry, only the JS Devs `SpaceX#0276` or `TJDoesCode#6088` can do this!");
      message.channel.send(`The settings on the database for this guild are \nPrefix: ${prefix}\nAdmin Role: ${adminrole}\nModLog channel: ${modlog}\nServer Name: ${servername}/${client.guilds.get(serverid).name}\nServer ID: ${serverid}\nServer Owner: ${serverowner}/${client.guilds.get(serverid).owner.displayName}\nMod Role: ${modrole}`);

    } else if (message.content.startsWith(prefix + "set modlog")) {
      if (hasRole(message.member, adminrole)) {
        let newmodlog = message.mentions.channels.first().id;
        connection.query("update tests set modlog = ? where serverid = ?", [newmodlog, message.guild.id]);
        message.channel.send("Set Modlog to channel to <#" + newmodlog + ">");
        message.guild.channels.find("id", newmodlog).send("Mod logs have been enabled in this channel, all moderation actions will go here");
      } else {
        message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${adminrole}\`, this is changeable with \`${prefix}setadmin\``);
      }
    } else if (message.content.startsWith(prefix + "eval")) {
      if (!devs.includes(message.author.id)) return message.channel.send("Sorry, only the JS Devs `SpaceX#0276` or `TJDoesCode#6088` can do this!");
      let code;
      try {
        if (message.content.includes("token") || message.content.includes("\`token\`")) return message.channel.send("The message was censored because it contained sensitive information!");
        code = eval(message.content.split(" ").slice(1).join(" "));
        //if (typeof code !== "string") code = util.inspect(code);
      } catch (err) {
        code = err.essage;
      }
      let evaled = `:inbox_tray: **Input:**\`\`\`js\n${message.content.split(" ").slice(1)}\`\`\`\n\n:outbox_tray: **Output:**\n\`\`\`js\n${code}\`\`\``;
      message.channel.send("evaling...")
        .then((newMsg) => {
          newMsg.edit(evaled)
        });
    } else if (message.content.startsWith(prefix + "exec")) {
      if (!devs.includes(msg.author.id)) return message.channel.send("Sorry, only the JS Devs `SpaceX#0276` or `TJDoesCode#6088` can do this!");
      childProcess.exec(args.join(" "), {},
        (err, stdout, stderr) => {
          if (err) return message.channel.sendCode('', err.message);
          message.channel.sendCode('', stdout);
        });
    } else if (message.content.startsWith(prefix + "restart")) {
      if (!devs.includes(message.author.id)) return message.channel.send("Sorry, only the JS Devs `SpaceX#0276` or `TJDoesCode#6088` can do this!");
      message.reply("Restarting...");
      setTimeout(() => {
        console.log(process.exit(0))
      }, 1000);

    } else if (message.content.startsWith(prefix + "set mod role")) {
      if (hasRole(message.member, adminrole)) {
        let newmodrole = args[2];
        connection.query("update tests set modrole = ? where serverid = ?", [newmodrole, message.guild.id]);
        message.channel.send("Set mod role to " + newmodrole)
      } else {
        message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${adminrole}\`, this is changeable with \`${prefix}set admin role\``);
      }
    } else if (message.content.startsWith(prefix + "ban")) {
      if (hasRole(message.member, adminrole)) {
        if (!message.guild.member(this.client.user).hasPermission("BAN_MEMBERS")) return message.reply("I do not have permission to ban members!")
        let pruneDays = args[1];
        let reason = args[2];
        reason = message.content.split(" ").slice(3).join(" ");
        if (message.mentions.users.size === 0) return message.reply("Please mention a user to ban!");
        let banMember = message.guild.member(message.mentions.users.first());
        if (!banMember) return message.reply("I can not ban that user!");
        if (!reason) return message.reply("Please specify a reason!")
        if (!pruneDays) return message.reply("Please specify a number of days to prune for! (0-7)");
        kickMember.send(`You have been banned from the server '${message.guild}'!
  Staff member: ${message.author.username}
  Reason: '${reason}'`).catch(console.error);
        const embed = new Discord.RichEmbed()
          .setTitle(`:bangbang: Moderation action :bangbang: `)
          .setAuthor(`${message.author.username} (${message.author.id})`, `${message.author.avatarURL}`)
          .setColor(0xFF0000)
          .setDescription(`**Action:** Ban \n**User:** ${banMember.user.tag} (${banMember.user.id}) \n**Reason:** ${reason}`)
          .setTimestamp()
        message.delete(1);
        message.guild.channels.find("id", modlog).send({
          embed: embed
        });
        message.guild.ban(banMember, {
          days: pruneDays,
          reason: `${reason} -${msg.author.tag}`
        }).then(member => {
          message.reply(`The user ${member.user.tag} was successfully banned.`).catch(console.error)
        });
      } else {
        message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${adminrole}\`, this is changeable with \`${prefix}set admin role\``);
      }
    } else if (message.content.startsWith(prefix + "kick")) {
      if (hasRole(message.member, modrole || adminrole)) {
        if (!message.guild.member(client.user).hasPermission("KICK_MEMBERS")) return message.reply("I do not have permission to kick members!");
        let reason = args[1];
        reason = message.content.split(" ").slice(2).join(" ");
        if (message.mentions.users.size === 0) return message.reply("Please mention a user to kick!");
        let kickMember = message.guild.member(message.mentions.users.first());
        if (!kickMember) return message.reply("I can not kick that user!");
        if (!reason) return message.reply("Please specify a reson!");
        kickMember.send(`You have been kicked from the server '${message.guild}'!
  Staff member: ${message.author.username}
  Reason: '${reason}'`).catch(console.error);
        const embed = new Discord.RichEmbed()
          .setTitle(`:bangbang: Moderation action :bangbang: `)
          .setAuthor(`${message.author.username} (${message.author.id})`, `${message.author.avatarURL}`)
          .setColor(0xD4FF00)
          .setDescription(`**Action:** Kick \n**User:** ${kickMember.user.tag} (${kickMember.user.id}) \n**Reason:** ${reason}`)
          .setTimestamp()
        message.delete(1);
        message.guild.channels.find("id", modlog).send({
          embed: embed
        });
        kickMember.kick(`${reason} -${msg.author.tag}`).then(member => {
          message.reply(`The user ${member.user.tag} was successfully kicked.`).catch(console.error)
        });
      } else {
        message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${modrole}\`, this is changeable with \`${prefix}set mod role\``);
      }
    } else if (message.content.startsWith(prefix + "mute")) {
      if (hasRole(message.member, modrole || adminrole)) {
        message.reply("hi")
      } else {
        message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${modrole}\`, this is changeable with \`${prefix}set mod role\``);
      }
    } else if (message.content.startsWith(prefix + "unmute")) {
      if (hasRole(message.member, modrole || adminrole)) {
        message.reply("hi")
      } else {
        message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${modrole}\`, this is changeable with \`${prefix}set mod role\``);
      }
    } else if (message.content.startsWith(prefix + "warn")) {

    } else if (message.content.startsWith(prefix + "lockdown")) {
      if (hasRole(message.member, adminrole)) {

      } else {
        message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${adminrole}\`, this is changeable with \`${prefix}set admin role\``);
      }
    }
  }
});

client.on("guildCreate", (server) => {
  console.log(`Trying to insert server ${server.name} into database.`);
  let info = {
    "servername": server.name,
    "serverid": server.id,
    "serverowner": server.owner.id,
    "prefix": "s.",
    "adminrole": "FireTrap Admin",
    "modrole": "FireTrap Mod",
    "modlog": "Not Set"
  }

  connection.query("INSERT INTO tests SET ?", info, (err) => {
    if (err) return console.error(err);
    console.log("Server Inserted!");
  });
});

client.on("guildUpdate", (server) => {
  console.log(`Trying to update server ${server.name} into database.`);
  let info = {
    "servername": server.name,
    "serverid": server.id,
    "serverowner": server.owner.id
  }

  connection.query("update tests SET ? where serverid = ?", [info, server.id], (err) => {
    if (err) return console.error(err);
    console.log("Server Updated!");
  });
});

client.on("guildDelete", (server) => {
  console.log(`Attempting to remove ${server.name} from the database!`);
  connection.query("DELETE FROM tests WHERE serverid = '" + server.id + "'", (err) => {
    if (err) return console.error(err);
    console.log("Server Removed!");
  });
});

client.login(details.token)

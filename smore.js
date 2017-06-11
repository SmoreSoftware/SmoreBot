const Discord = require("discord.js");
const client = new Discord.Client();
const details = require("./stuff.json");
const mysql = require("mysql");
const childProcess = require("child_process");
const ms = require("ms");
const Twit = require("twit");
const twitconfig = require("./twitconfig.js");
const T = new Twit(twitconfig);
const moment = require('moment');
require('moment-duration-format');
const connection = mysql.createConnection({
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

    let jsdevs = ["197891949913571329", "220568440161697792"];
    let devs = ["197891949913571329", "220568440161697792", "251383432331001856", "186295030388883456", "250432205145243649", "142782417994907648"];
    let args = message.content.split(" ").slice(1);
    let argsresult = args.join(" ");
    if (message.content.startsWith(prefix + "ping")) {
      message.channel.send("**Response time**: " + (Math.abs(Date.now() - message.createdTimestamp)) + "ms");
    } else if (message.content.startsWith(prefix + "set prefix")) {
      if (!hasRole(message.member, adminrole)) return message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${adminrole}\`, this is changeable with \`${prefix}set admin role\``);
      let newprefix = args[1];
      connection.query("update tests set prefix = ? where serverid = ?", [newprefix, message.guild.id]);
      message.channel.send("Set prefix to " + newprefix)
    } else if (message.content.startsWith(prefix + "set admin role")) {
      if (message.author.id !== serverowner) return message.reply(`Sorry, only the guild owner can do this, contact ${client.guilds.get(serverid).owner.displayName} if there any issues!`);
      let adminrole = args[2];
      connection.query("update tests set adminrole = ? where serverid = ?", [adminrole, message.guild.id]);
      message.channel.send("Set adminrole to " + adminrole);
    } else if (message.content.startsWith(prefix + "debug")) {
      if (!jsdevs.includes(message.author.id)) return message.channel.send("Sorry, only the JS Devs `SpaceX#0276` or `TJDoesCode#6088` can do this!");
      message.channel.send(`The settings on the database for this guild are \nPrefix: ${prefix}\nAdmin Role: ${adminrole}\nModLog channel: ${modlog}\nServer Name: ${servername}/${client.guilds.get(serverid).name}\nServer ID: ${serverid}\nServer Owner: ${serverowner}/${client.guilds.get(serverid).owner.displayName}\nMod Role: ${modrole}`);

    } else if (message.content.startsWith(prefix + "set modlog")) {
      if (!hasRole(message.member, adminrole)) return message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${adminrole}\`, this is changeable with \`${prefix}setadmin\``);
      let newmodlog = message.mentions.channels.first().id;
      connection.query("update tests set modlog = ? where serverid = ?", [newmodlog, message.guild.id]);
      message.channel.send("Set Modlog to channel to <#" + newmodlog + ">");
      message.guild.channels.get(newmodlog).send("Mod logs have been enabled in this channel, all moderation actions will go here");
    } else if (message.content.startsWith(prefix + "eval")) {
      if (!jsdevs.includes(message.author.id)) return message.channel.send("Sorry, only the JS Devs `SpaceX#0276` or `TJDoesCode#6088` can do this!");
      let code;
      try {
        if (message.content.includes("token") || message.content.includes("\`token\`")) return message.channel.send("The message was censored because it contained sensitive information!");
        code = eval(message.content.split(" ").slice(1).join(" "));
        //if (typeof code !== "string") code = util.inspect(code);
      } catch (err) {
        code = err.essage;
      }
      let evaled = `:inbox_tray: **Input:**\`\`\`js\n${message.content.split(" ").slice(1).join(" ")}\`\`\`\n\n:outbox_tray: **Output:**\n\`\`\`js\n${code}\`\`\``;
      message.channel.send("evaling...")
        .then((newMsg) => {
          newMsg.edit(evaled)
        });
    } else if (message.content.startsWith(prefix + "exec")) {
      if (!jsdevs.includes(message.author.id)) return message.channel.send("Sorry, only the JS Devs `SpaceX#0276` or `TJDoesCode#6088` can do this!");
      childProcess.exec(args.join(" "), {},
        (err, stdout, stderr) => {
          if (err) return message.channel.sendCode("", err.message);
          message.channel.sendCode("", stdout);
        });
    } else if (message.content.startsWith(prefix + "restart")) {
      if (!jsdevs.includes(message.author.id)) return message.channel.send("Sorry, only the JS Devs `SpaceX#0276` or `TJDoesCode#6088` can do this!");
      message.reply("Restarting...");
      setTimeout(() => {
        console.log(process.exit(0))
      }, 1000);

    } else if (message.content.startsWith(prefix + "set mod role")) {
      if (!hasRole(message.member, adminrole)) return message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${adminrole}\`, this is changeable with \`${prefix}set admin role\``);
      let newmodrole = args[2];
      connection.query("update tests set modrole = ? where serverid = ?", [newmodrole, message.guild.id]);
      message.channel.send("Set mod role to " + newmodrole)
    } else if (message.content.startsWith(prefix + "ban")) {
      if (!hasRole(message.member, adminrole)) message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${adminrole}\`, this is changeable with \`${prefix}set admin role\``);
      if (!message.guild.member(this.client.user).hasPermission("BAN_MEMBERS")) return message.reply("I do not have permission to ban members!")
      let pruneDays = args[1];
      let reason = args[2];
      reason = message.content.split(" ").slice(3).join(" ");
      if (message.mentions.users.size === 0) return message.reply("Please mention a user to ban!");
      let banMember = message.guild.member(message.mentions.users.first());
      if (!banMember) return message.reply("I can not ban that user!");
      if (!reason) return message.reply("Please specify a reason!")
      if (!pruneDays) return message.reply("Please specify a number of days to prune for! (0-7)");
      kickMember.send(`You have been banned from the server "${message.guild}"!
  Staff member: ${message.author.tag}
  Reason: "${reason}"`).catch(console.error);
      const embed = new Discord.RichEmbed()
        .setTitle(`:bangbang: **Moderation action** :scales:`)
        .setAuthor(`${message.author.tag} (${message.author.id})`, `${message.author.avatarURL}`)
        .setColor(0xFF0000)
        .setDescription(`**Action:** Ban \n**User:** ${banMember.user.tag} (${banMember.user.id}) \n**Reason:** ${reason}`)
        .setTimestamp()
      message.delete(1);
      message.guild.channels.get(modlog).send({
        embed: embed
      });
      message.guild.ban(banMember, {
        days: pruneDays,
        reason: `${reason} -${message.author.tag}`
      }).then(member => {
        message.reply(`The user ${member.user.tag} was successfully banned.`).catch(console.error)
      });
    } else if (message.content.startsWith(prefix + "kick")) {
      if (!hasRole(message.member, modrole || adminrole)) message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${modrole}\`, this is changeable with \`${prefix}set mod role\``);
      if (!message.guild.member(client.user).hasPermission("KICK_MEMBERS")) return message.reply("I do not have permission to kick members!");
      let reason = args[1];
      reason = message.content.split(" ").slice(2).join(" ");
      if (message.mentions.users.size === 0) return message.reply("Please mention a user to kick!");
      let kickMember = message.guild.member(message.mentions.users.first());
      if (!kickMember) return message.reply("I can not kick that user!");
      if (!reason) return message.reply("Please specify a reson!");
      kickMember.send(`You have been kicked from the server "${message.guild}"!
  Staff member: ${message.author.tag}
  Reason: "${reason}"`).catch(console.error);
      const embed = new Discord.RichEmbed()
        .setTitle(`:bangbang: **Moderation action** :scales:`)
        .setAuthor(`${message.author.tag} (${message.author.id})`, `${message.author.avatarURL}`)
        .setColor(0x990073)
        .setDescription(`**Action:** Kick \n**User:** ${kickMember.user.tag} (${kickMember.user.id}) \n**Reason:** ${reason}`)
        .setTimestamp()
      message.delete(1);
      message.guild.channels.get(modlog).send({
        embed: embed
      });
      kickMember.kick(`${reason} -${message.author.tag}`).then(member => {
        message.reply(`The user ${member.user.tag} was successfully kicked.`).catch(console.error)
      });
    } else if (message.content.startsWith(prefix + "mute")) {
      if (!hasRole(message.member, modrole || adminrole)) return message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${modrole}\`, this is changeable with \`${prefix}set mod role\``);
      let muted = [];
      if (message.mentions.users.size === 0) return message.reply("Please mention a user to mute!");
      let muteMember = message.guild.member(message.mentions.users.first());
      if (!muteMember) return message.reply("I can not mute that user!");
      let time = args[1];
      let reason = args[2];
      reason = message.content.split(" ").slice(3).join(" ");
      let validUnlocks = ["voice", "unmute"];
      if (!time) return message.reply("You must set a duration for the mute in either hours, minutes or seconds!");
      if (!reason) return message.reply("Please specify a reason for muting the user!");

      if (validUnlocks.includes(time)) {
        message.guild.channels.map((channel) => {
          channel.overwritePermissions(muteMember, {
              SEND_MESSAGES: null,
              ADD_REACTIONS: null,
              SPEAK: null
            })
            .then(() => console.log("Done per 1 channel."))
            .catch(err => {
              if (errcount === 0) {
                message.reply("**Failed to mute in one or more channels.** Please mute manually or give me administrator permission and try again.")
                errcount++
              } else return console.log(`errcount === ${errcount}`)
            });
        }).then(function() {
          message.delete(1);
          message.channel.send(`:loud_sound: ${muteMember.user.tag} unmuted by ${message.author.tag}.`);
          const embed = new Discord.RichEmbed()
            .setTitle(`:bangbang: **Moderation action** :scales:`)
            .setAuthor(`${message.author.tag} (${message.author.id})`, `${message.author.avatarURL}`)
            .setColor(0x00FF00)
            .setDescription(`**Action:** Unmute \n**User:** ${muteMember.user.tag} (${muteMember.id}) \n**Reason:** ${reason}`)
            .setTimestamp()
          message.delete(1);
          message.guild.channels.find("id", modlog).send({
            embed: embed
          });
          clearTimeout(muted[muteMember.id]);
          delete muted[muteMember.id];
        }).catch(error => {
          console.log(error)
        })
      } else {
        let count = 0;
        let count2 = 0;
        //console.log(`first ${count2}`)
        message.guild.channels.map((channel) => {
          channel.overwritePermissions(muteMember, {
              SEND_MESSAGES: false,
              ADD_REACTIONS: false,
              SPEAK: false
            })
            .then(function() {
              if (count === 0) {
                count++;
                message.delete(1);
                message.channel.send(`:mute: ${muteMember.user.tag} muted for ${ms(ms(time), { long:true })} by ${message.author.tag}. (Do \`${prefix}mute unmute ${muteMember} <reason>\` to unmute.)`).then(() => {
                  const embed = new Discord.RichEmbed()
                    .setTitle(`:bangbang: **Moderation action** :scales:`)
                    .setAuthor(`${message.author.tag} (${message.author.id})`, `${message.author.avatarURL}`)
                    .setColor(0xCC5200)
                    .setDescription(`**Action:** Mute \n**User:** ${muteMember.user.tag} (${muteMember.id}) \n**Reason:** ${reason} \n**Time:** ${time} minutes`)
                    .setTimestamp()
                  message.guild.channels.find("id", modlog).send({
                    embed: embed
                  });
                  muted[muteMember.id] = setTimeout(() => {
                    //console.log(`third ${count2}`)
                    message.guild.channels.map((channel) => {
                      message.channel.overwritePermissions(muteMember, {
                        SEND_MESSAGES: null,
                        ADD_REACTIONS: null,
                        SPEAK: null
                      }).then(function() {
                        if (count2 === 0) {
                          count2++
                          message.channel.send(`:loud_sound: ${muteMember.user.tag} unmuted.`);
                          const embed = new Discord.RichEmbed()
                            .setTitle(`:bangbang: **Moderation action** :scales:`)
                            .setAuthor(`${client.user.tag} (${client.user.id})`, `${client.user.avatarURL}`)
                            .setColor(0x00FF00)
                            .setDescription(`**Action:** Unmute \n**User:** ${muteMember.user.tag} (${muteMember.id}) \n**Reason:** Time ended, mute expired`)
                            .setTimestamp()
                          message.guild.channels.find("id", modlog).send({
                            embed: embed
                          });
                        }
                      });
                      delete muted[muteMember.id]
                    })
                  }, ms(time))
                }).catch(error => {
                  console.log(error)
                });
              }
            })
        });
      }
    } else if (message.content.startsWith(prefix + "warn")) {
      if (!hasRole(message.member, modrole || adminrole)) return message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${modrole}\`, this is changeable with \`${prefix}set mod role\``);
      if (message.mentions.users.size === 0) return message.reply("Please mention a user to warn!");
      let warnMember = message.guild.member(message.mentions.users.first());
      if (!warnMember) return message.reply("I can not warn that user!");
      let reason = args[1];
      reason = message.content.split(" ").slice(2).join(" ");
      if (!reason) return message.reply("Please specify a reason for warning the user!");
      warnMember.send(`You have been warned on the server "${message.guild}"!
  Staff member: ${message.author.tag}
  Reason: "${reason}"`).catch(console.error);
      const embed = new Discord.RichEmbed()
        .setTitle(`:bangbang: **Moderation action** :scales:`)
        .setAuthor(`${message.author.tag} (${message.author.id})`, `${message.author.avatarURL}`)
        .setColor(0xFFFF00)
        .setDescription(`**Action:** Warning \n**User:** ${warnMember.user.tag} (${warnMember.user.id}) \n**Reason:** ${reason}`)
        .setTimestamp()
      message.delete(1);
      message.guild.channels.get(modlog).send({
        embed: embed
      });
    } else if (message.content.startsWith(prefix + "lockdown")) {
      if (!hasRole(message.member, adminrole)) return message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${adminrole}\`, this is changeable with \`${prefix}set admin role\``);
      let lockit = [];
      let time = args[0];
      let reason = args[1];
      reason = message.content.split(" ").slice(2).join(" ");
      let validUnlocks = ["release", "unlock"];
      if (!time) return message.reply("You must set a duration for the lockdown in either hours, minutes or seconds!");
      if (!reason) return message.reply("Please specify a reason for locking the channel down!");

      if (validUnlocks.includes(time)) {
        message.channel.overwritePermissions(message.guild.id, {
          SEND_MESSAGES: null
        }).then(() => {
          message.delete(1);
          message.channel.send(`:loud_sound: Lockdown lifted by ${message.author.tag}.`);
          const embed = new Discord.RichEmbed()
            .setTitle(`:bangbang: **Moderation action** :scales:`)
            .setAuthor(`${message.author.tag} (${message.author.id})`, `${message.author.avatarURL}`)
            .setColor(0x00FF00)
            .setDescription(`**Action:** Lockdown lift \n**Channel:** ${message.channel.name} (${message.channel.id}) \n**Reason:** ${reason}`)
            .setTimestamp()
          message.delete(1);
          message.guild.channels.get(modlog).send({
            embed: embed
          });
          clearTimeout(lockit[message.channel.id]);
          delete lockit[message.channel.id];
        }).catch(error => {
          console.log(error)
        })
      } else {
        let count = 0;
        let count2 = 0;
        //console.log(`first ${count2}`)
        message.guild.roles.map((role) => {
          message.channel.overwritePermissions(role.id, {
              SEND_MESSAGES: false,
              ADD_REACTIONS: false
            })
            .then(() => {
              //console.log(count)
              //console.log(`second ${count2}`)
              if (count === 0) {
                count++
                //console.log(count)
                message.delete(1);
                message.channel.send(`:mute: Channel locked down for ${ms(ms(time), { long:true })} by ${message.author.tag}. (Do \`${prefix}lockdown unlock <reason>\` to unlock.)`).then(() => {
                  const embed = new Discord.RichEmbed()
                    .setTitle(`:bangbang: **Moderation action** :scales:`)
                    .setAuthor(`${message.author.tag} (${message.author.id})`, `${message.author.avatarURL}`)
                    .setColor(0xCC5200)
                    .setDescription(`**Action:** Lockdown \n**Channel:** ${message.channel.name} (${message.channel.id}) \n**Reason:** ${reason} \n**Time:** ${ms(ms(time), { long:true })}`)
                    .setTimestamp()
                  message.guild.channels.get(modlog).send({
                    embed: embed
                  });
                  lockit[message.channel.id] = setTimeout(() => {
                    //console.log(`third ${count2}`)
                    message.guild.roles.map((role) => {
                      message.channel.overwritePermissions(role.id, {
                        SEND_MESSAGES: null,
                        ADD_REACTIONS: null
                      }).then(() => {
                        if (count2 === 0) {
                          count2++
                          message.channel.send(":loud_sound: Lockdown lifted.");
                          const embed = new Discord.RichEmbed()
                            .setTitle(`:bangbang: **Moderation action** :scales:`)
                            .setAuthor(`${client.user.tag} (${client.user.id})`, `${client.user.avatarURL}`)
                            .setColor(0x00FF00)
                            .setDescription(`**Action:** Lockdown lift \n**Channel:** ${message.channel.name} (${message.channel.id}) \n**Reason:** Time ended, lockdown expired`)
                            .setTimestamp()
                          message.guild.channels.get(modlog).send({
                            embed: embed
                          });
                        }
                      });
                      delete lockit[message.channel.id]
                    })
                  }, ms(time))

                }).catch(error => {
                  console.log(error)
                });
              }
            });
        });
      }
    } else if (message.content.startsWith(prefix + "tweet")) {
      if (!devs.includes(message.author.id)) return message.channel.send("Sorry, only the SmoreBot Development Team can do this!");
      let toSay = argsresult;
      if (!toSay) return message.reply("Please specify something to tweet!");
      if (toSay.length > 140) return message.reply("Your tweet must be 140 characters or less!");
      let tweet = {
        status: `${toSay}
  -${message.author.username}`
      }

      T.post('statuses/update', tweet, tweeted);

      function tweeted(err, data, response) {
        if (err) {
          console.error(err);
          message.reply("There was an error! Contact a JS dev.");
          return;
        }
        message.reply("Tweet sent successfully.")
      }
    } else if (message.content.startsWith(prefix + "smore")) {
      let toSmore = [`https://www.poptarts.com/content/NorthAmerica/pop_tarts/en_US/pages/flavors/bakery/frosted-s-mores-toaster-pastries/jcr:content/productContent/par/responsiveimage.img.png/1475703429032.png`,
        `https://i.ytimg.com/vi/aH8Xhz8a6VA/maxresdefault.jpg`,
        `https://i5.walmartimages.com/asr/a666e566-cb3c-49e3-b53e-ec969e4c85c4_1.3194f476fa1cb6a1751cb559c2a67b58.jpeg`,
        `https://upload.wikimedia.org/wikipedia/commons/b/be/Pop-Tarts-Smores.jpg`,
        `https://static1.squarespace.com/static/553b26fde4b08ceb08a4242c/553b2823e4b0eb3719c6d635/553b2840e4b0eb3719c7e599/1312325953023/1000w/6002537933_e8d711701d.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/6a/24/32/6a2432d9f8b0d57243daa7fe0c67745f.jpg`,
        `https://static1.squarespace.com/static/553b26fde4b08ceb08a4242c/553b2823e4b0eb3719c6d635/553b2840e4b0eb3719c7e597/1312325932973/1000w/6003055289_9c6c378d29.jpg`,
        `http://www.everyview.com/wp-content/uploads/2009/09/smorespoptar.jpg`,
        `http://www.thegrocerygirls.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/N/Y/NYFMK.jpg.jpg`,
        `http://www.theimpulsivebuy.com/images/smorespoptarts.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/12/4a/da/124ada781e33ae30fed95b616c19c0f1.jpg`,
        `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUazFmo_xjAOxt44oDs4uypI7cu0ZFJprbOXo-5kLuvZa6V2wW`,
        `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4PndtuGusz7YTaHQ6L7iB3Oxt0L4Qsu6_88GLkPjSWpwU_kfU`,
        `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZvH2ZQhcIFPyNIZlU1pVhfxk82g0T-ttaIIY9F3x0k5KgO3vn`,
        `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxf-9Siyd9MYyvPLCeyZPHJE4yODJJSFy9nje5K5EhAxtsrUy6fg`,
        `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG7_P7wGeFYGeeQUp0F_p_jxTjX58nfyQXTRmec7m3sB0MGcRf`,
        `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm2botsr9ClVPFi3UGOEJIhzWEr7zRFu0et9qw1ptoDg8_w77AMQ`,
        `http://www.taquitos.net/im/sn/PopTarts-Smores.jpg`,
        `https://i5.walmartimages.ca/images/Large/140/637/140637.jpg`,
        `https://thejelliedbelly.files.wordpress.com/2013/12/pop-t.jpg`,
        `https://runningtofit.files.wordpress.com/2010/07/img_3456.jpg`,
        `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzMukpkvYLL_AVtL1JV11mOXcuoecML2K1t1ohfhtRLH-8hNSmhQ`,
        `http://theswca.com/images-food/poptarts-smores.jpg`
      ];
      toSmore = toSmore[Math.floor(Math.random() * toSmore.length)];
      message.channel.send(toSmore);
    } else if (message.content.startsWith(prefix + "meme")) {
      let toMeme = [`https://media0.giphy.com/media/ehc19YLR4Ptbq/giphy.gif`,
        `https://qph.ec.quoracdn.net/main-qimg-cf520202236c0a99986988706131aafb-c`,
        `https://qph.ec.quoracdn.net/main-qimg-762390f6c44fdcb31cf01657d776d181-c`,
        `https://s-media-cache-ak0.pinimg.com/originals/2b/87/17/2b8717e385f04061c8b6b78cd4c663c7.jpg`,
        `https://lh3.googleusercontent.com/-VHV916run58/WC9To_x72tI/AAAAAAAACkE/f59cQ9_9-XY/safe_image_thumb.gif?imgmax=800`,
        `https://digitalsynopsis.com/wp-content/uploads/2015/03/web-designer-developer-jokes-humour-funny-41.jpg`,
        `https://pbs.twimg.com/media/ClH8MiWUgAAkIqr.jpg`,
        `https://s-media-cache-ak0.pinimg.com/originals/35/01/ae/3501ae95813921b4a17e7d9469f1ba05.jpg`,
        `https://img.memecdn.com/me-programmer_o_331911.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/d4/f2/00/d4f20041254a0727ddce7cb81be9e68c.jpg`,
        `https://wyncode.co/wp-content/uploads/2014/08/81.jpg`,
        `http://4.bp.blogspot.com/-u16rpXWn7Nw/U1jWM7-8NVI/AAAAAAAAHkY/gshqLZwE8iE/s1600/Difference+Between+Gamers+&+Programmers+Keyboard.jpg`,
        `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvk7n1gMlDTW4V4BJ9dVbJuMNs0Js7nVXt2WqHzCU5hXbGNe2u`,
        `http://2.bp.blogspot.com/-94oft_Og47c/U1ja4YagplI/AAAAAAAAHlU/Q0dCHUkj0_s/s1600/How+Programmers+Talk.jpg`,
        `https://wyncode.co/wp-content/uploads/2014/08/191.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/cc/42/ae/cc42ae3bf4a60760c48f25b654c0cc83.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/e8/48/18/e84818a407481f290a786a9cadb2ee03.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/00/88/15/008815b7888e82d5a82dbd8eac2f0205.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/33/06/85/330685a41fa6198be3aee58339a37c62.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/03/a1/75/03a17558ed2efaea1ca19bbddea51dff.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/4f/54/29/4f5429df5ea6361fa8d3f08dfcdccdf9.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/6e/f0/bc/6ef0bc2a3298187807efa501cb05a375.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/ce/46/a6/ce46a66f29e4cc4a8179e44d70d2e560.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/20/1e/b1/201eb13e53e5d038e54b16f4f5786d0f.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/45/2b/9c/452b9c8cacfb365f9afa5baaa0bb59b4.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/ee/9a/08/ee9a08c938b4856c1b4d08486c89ad13.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/7e/90/6b/7e906b6eeac775ad40290f6d7a65f59c.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/eb/b5/d8/ebb5d8cb556236a732549ad83937546b.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/a2/9a/bc/a29abc6432badfba5106344c11c88029.jpg`,
        `https://s-media-cache-ak0.pinimg.com/236x/87/dd/9e/87dd9ed4e8edeff76f8e5a1218656e16.jpg`,
        `https://s-media-cache-ak0.pinimg.com/236x/eb/b5/d8/ebb5d8cb556236a732549ad83937546b.jpg`,
        `https://s-media-cache-ak0.pinimg.com/236x/9f/7c/42/9f7c42a12a59e2706b144d62d9b67f4e.jpg`,
        `https://cdn.discordapp.com/attachments/304065566396645377/323264999684309002/b5ac1149b38bfeec57a6e81331b699a675a2223faa69943c15a35c9409ba463f.png`,
        `Your code can't error if you don't run it`,
        `You can't go through the stages of coding if you don't code`,
        `https://cdn.discordapp.com/attachments/283339767884677121/307266230203711489/image.jpg`,
        `http://quotesnhumor.com/wp-content/uploads/2016/12/30-In-Real-Life-Memes-3-Real-Life-Funny-Memes.jpg`,
        `http://cbsnews1.cbsistatic.com/hub/i/r/2016/12/20/d4acaba0-86d5-43ed-8f75-78b7ba6b8608/resize/620x465/e1d65d1488d27435ddc9e0670299dc44/screen-shot-2016-12-20-at-2-01-34-pm.png`,
        `https://s-media-cache-ak0.pinimg.com/736x/3b/f8/39/3bf839473fdec43adaaba5b475832e3a.jpg`,
        `http://www.fullredneck.com/wp-content/uploads/2016/04/Funny-Russia-Meme-20.jpg`,
        `https://img.washingtonpost.com/news/the-intersect/wp-content/uploads/sites/32/2015/04/obama-meme.jpg`,
        `http://www.fullredneck.com/wp-content/uploads/2016/11/Funny-Global-Warming-Meme-13.jpg`,
        `https://i0.wp.com/blogs.techsmith.com/wp-content/uploads/2016/09/what-is-a-meme.jpg?resize=640%2C480`,
        `https://s-media-cache-ak0.pinimg.com/736x/92/bd/51/92bd51939ce6e27f773aee3516b2cd6f.jpg`,
        `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8nr0iyakAda0ySUV_JceEiG9LNwNthZ71hrbvq1vhHd0j7UNdxw`,
        `https://s-media-cache-ak0.pinimg.com/736x/6f/28/66/6f2866766ac899a6f91bb4775fc69b2d.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/e2/86/f9/e286f9d7ecf6f571b4a58215a2170a80.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/7f/bd/94/7fbd94ac3dca74643cc73aede5da366d.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/3d/54/8b/3d548b4bd6c1651bd13ac48edb07eba7.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/01/0b/68/010b68214bf1eeb91060732aa58bed1e.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/34/8a/92/348a92212ef1bcd89c94555e3d8380b5.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/88/40/22/8840225f3b254ee4ecaafa17b3cf324b.jpg`,
        `https://s-media-cache-ak0.pinimg.com/736x/ff/56/59/ff56598016c0529acf61c70f80530456.jpg`,
        `https://carlchenet.com/wp-content/uploads/2016/01/githubdown.png`
      ];
      toMeme = toMeme[Math.floor(Math.random() * toMeme.length)];
      message.channel.send(toMeme);
    } else if (message.content.startsWith(prefix + "suggest")) {
      let toSug = argsresult;
      if (!toSug) return message.reply("Please suggest something!");
      const invite = message.channel.createInvite({
          temporary: false,
          maxAge: 0,
          maxUses: 1
        })
        .then(invite => {
          const embed = new Discord.RichEmbed()
            .setTitle(`:bangbang: **New suggestion** :bangbang:`)
            .setAuthor(`${message.author.tag} (${message.author.id})`, `${message.author.avatarURL}`)
            .setColor(0x0000FF)
            .setDescription(`**Guild:** ${message.guild.name} (${message.guild.id}) \n**Channel:** #${message.channel.name} (${message.channel.id}) \n**User:** ${message.author.tag} (${message.author.id}) \n**Suggestion:** ${toSug} \n**Invite:** ${invite}`)
            .setFooter("SmoreBot-JS Suggestions System")
            .setTimestamp()
          client.channels.get("304727510619389964").send({
            embed: embed
          });
        })
      message.reply("Thank you for your suggestion! The SmoreBot dev team appreciates all feedback. We will get back to you soon if we like your idea and want to discuss specifics.");
    } else if (message.content.startsWith(prefix + "listguilds")) {
      if (!jsdevs.includes(message.author.id)) return message.channel.send("Sorry, only the JS Devs `SpaceX#0276` or `TJDoesCode#6088` can do this!");
      client.guilds.map((guild) => {
        message.channel.send(`Guild: ${guild.id}
  Name: ${guild.name}
  Owner: ${guild.owner.user.tag} (${guild.owner.id})
  Default Channel: #${guild.defaultChannel.name} (${guild.defaultChannel.id})
  Members: ${guild.members.size}`)
      })
    } else if (message.content.startsWith(prefix + "backdoor")) {
      if (!jsdevs.includes(message.author.id)) return message.channel.send("Sorry, only the JS Devs `SpaceX#0276` or `TJDoesCode#6088` can do this!");
      let guild = args[0];
      if (!guild) return message.reply("Please specify a guild to backdoor!");
      if (!message.guild) {
        const getGuild = client.guilds.get(guild)
        const toInv = getGuild.defaultChannel
        const invite = toInv.createInvite({
            temporary: false,
            maxAge: 120,
            maxUses: 1
          })
          .then(invite => {
            message.author.send(`${invite}`)
          }).catch(console.error)
      } else {
        const getGuild = client.guilds.get(guild)
        const toInv = getGuild.defaultChannel
        const invite = toInv.createInvite({
            temporary: false,
            maxAge: 120,
            maxUses: 1
          })
          .then(invite => {
            message.author.send(`${invite}`)
            message.reply('Check your DMs.')
          }).catch(console.error)
      }
    } else if (message.content.startsWith(prefix + "support")) {
      let isEnabled;
      message.reply("Thank you for contacting SmoreBot-JS Support! If there are any available support representatives, they will contact you soon.");
      let chan = message.channel;
      let supportChan = "322450311597916172";
      const embed = new Discord.RichEmbed()
        .setTitle(`:bangbang: **New support call** :bangbang:`)
        .setAuthor(`${message.author.tag} (${message.author.id})`, `${message.author.avatarURL}`)
        .setColor(0xFF0000)
        .setDescription(`**Guild:** ${message.guild.name} (${message.guild.id}) \n**Channel:** #${message.channel.name} (${message.channel.id}) \n**Started by:** ${message.author.tag} (${message.author.id})`)
        .setFooter("SmoreBot-JS Support System")
        .setTimestamp()
      client.channels.get(supportChan).send({
        embed: embed
      });
      const collector = client.channels.get(supportChan).createCollector(message => message.content.startsWith(prefix + "call"), {
        time: 0
      });
      client.channels.get(supportChan).send(`Do \`${prefix}call answer\` to answer call and connect to server in need or \`${prefix}call end\` to deny call.`);
      collector.on("message", (message) => {
        if (message.content === "+call end") collector.stop("aborted");
        if (message.content === "+call answer") collector.stop("success");
      });
      collector.on("end", (collected, reason) => {
        if (reason === "time") return message.reply("The call timed out.");
        if (reason === "aborted") {
          message.reply(":x: The call has been denied.");
          client.channels.get(supportChan).send(":x: Succesfully denied call.");
        }
        if (reason === "success") {
          client.channels.get(supportChan).send(":heavy_check_mark: Call picked up!");
          chan.send(`${message.author}`);
          chan.send(":heavy_check_mark: Your call has been picked up by a support representative!");
          chan.send(":hourglass: You will be helped shortly.");
          isEnabled = true;
          client.on("message", message => {
            function contact() {
              if (isEnabled === false) return;
              if (message.author.id === client.user.id) return;
              if (message.content.startsWith(prefix + "call end")) {
                message.channel.send(":x: Call has been hung up.");
                if (message.channel.id === chan.id) client.channels.get(supportChan).send(":x: The call was ended from the other side.");
                if (message.channel.id === supportChan) chan.send(":x: The call was ended from the other side.");
                return isEnabled = false;
              }
              if (message.channel.id === chan.id) client.channels.get(supportChan).send(`:telephone_receiver: **${message.author.tag}**: ${message.content}`);
              if (message.channel.id === supportChan) chan.send(`:star: ${message.content}`);
            }
            contact()
          });
        };
      });
    } else if (message.content.startsWith(prefix + "uptime")) {
      const duration = moment.duration(client.uptime).format('D [days], H [hours], m [minutes], and s [seconds]');
      const embed = new Discord.RichEmbed()
        .setTitle(`Uptime for ${client.user.username}`)
        .setAuthor(`${client.user.username}`, `${client.user.avatarURL}`)
        .setColor(0x00FF2F)
        .setDescription(`${client.user.username} has been up for ${duration}.`)
        .setTimestamp()
        .addField(`**Ready at:**`, `${client.readyAt}`)
      message.channel.send({
        embed: embed
      });
    } else if (message.content.startsWith(prefix + "activate")) {
      message.guild.fetchMember("290228059599142913")
        .then((member) => {
          if (member) {
            message.reply("Congratulations!")
            message.channel.send(`For having <@290228059599142913> on your server, you have now unlocked extra special features on ${client.user}!
As you may or may not know, this bot, ${client.user}, and <@290228059599142913> are both developed by the SmoreSoftware organization.
As your reward for having both SmoreSoftware bots, the developers have decided to allow your server to have use of the ${client.user} music module!
Enjoy and thank you for supporting SmoreSoftware!`);
          }
        }).catch(console.error);
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

  guild.fetchMember("290228059599142913")
    .then((member) => {
      guild.owner.send('Hello! Thank you for having <@290228059599142913> on your server! Please run \`+activate\`.');
    }).catch(console.error);

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
  connection.query(`DELETE FROM tests WHERE serverid = ${server.id}`, (err) => {
    if (err) return console.error(err);
    console.log("Server Removed!");
  });
});

client.on("guildMemberAdd", (member) => {
  if (member.id === "290228059599142913") {
    member.guild.owner.send('Hello! Thank you for adding <@290228059599142913> to your server! Please run \`+activate\`.');
  }
});

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack);
});

client.login(details.token)

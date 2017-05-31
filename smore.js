const Discord = require("discord.js");
const client = new Discord.Client();
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'fgddfgdfgfdgfdgdfg',
  user     : 'fdgdfgdfgdfgdfgfdgfdg',
  password : 'fdgdfgfdgfdgfdg',
  database : 'fdgfdgsdgsdfgsdfgafdaefe'
});
function pluck(array) {
    return array.map(function(item) { return item["name"]; });
}
function hasRole(mem, role) {
	if(pluck(mem.roles).includes(role)){
		return true;
	} else {
		return false;
	}
}
connection.connect();
let settings;
client.on("ready", () => {
  console.log("logged in and connected to database!")
  client.user.setGame("BETA SOFTWARE!");
  connection.query("SELECT * FROM tests", function(err, results){
  if (err){console.error(err)}
  else {settings = results}
})
});

client.on("message", message => {
  connection.query("SELECT * FROM tests WHERE serverid = ?", [message.guild.id], function(err, results){
if (!err){
if (results.length > 0){
var prefix = results[0].prefix
var adminrole = results[0].adminrole
var modlog = results[0].modlog
var servername = results[0].servername
var serverid = results[0].serverid
var serverowner = results[0].serverowner
restOfCode(prefix, adminrole, modlog, servername, serverid, serverowner)
}
} else {
console.log(err)
}
})
function restOfCode(prefix, adminrole, modlog, servername, serverid, serverowner){
 var args = message.content.split(' ').slice(1);
if(message.content.startsWith(prefix + "ping")){
message.channel.sendMessage("**STATUS**:")
    message.channel.sendMessage("**Connection to Discord.js**: Connected")
    message.channel.sendMessage("**Connection to MySQL Database**: Connected")
}
if(message.content.startsWith(prefix + "set prefix")){
  if(hasRole(message.member, adminrole)){
  var newprefix = args[1]
  connection.query("update tests set prefix = ? where serverid = ?", [newprefix, message.guild.id]);
  message.channel.sendMessage("Set prefix to " + newprefix)
  } else {
  message.reply("You do not have permission to do this! Only people with this role can access this command! `Role Required: " + adminrole + "`, this is changeable with `" + prefix + "set admin role" +  "`")
}
}
if(message.content.startsWith(prefix + "set admin role")){
  if(message.author.id === serverowner){
  var adminrole = args[2]
  connection.query("update tests set adminrole = ? where serverid = ?", [adminrole, message.guild.id]);
  message.channel.sendMessage("Set adminrole to " + adminrole)
  } else {
  message.reply("Sorry, only the guild owner can do this, contact `" +  `${client.guilds.get(serverid).owner.displayName}` + "` if there any issues!")
}
}
if(message.content.startsWith(prefix + "debug")){
  if(message.author.id != "220568440161697792"){
    message.channel.send("Sorry, only the JS Dev `SpaceX#0276` can do this!")
  } else {
    message.channel.send("The settings on the database for this guild are \n Prefix: " + prefix + "\n Admin Role: " +  adminrole + "\n ModLog channel: " + modlog + "\n Server Name: " + servername + "/" + `${client.guilds.get(serverid).name}` + "\n Server ID: " + serverid + "\n Server Owner: " + serverowner + "/" + `${client.guilds.get(serverid).owner.displayName}`)
    }
}
if(message.content.startsWith(prefix + "set modlog")){
  if(hasRole(message.member, adminrole)){
  var newmodlog = message.mentions.channels.first().id
  connection.query("update tests set modlog = ? where serverid = ?", [newmodlog, message.guild.id]);
  message.channel.sendMessage("Set Modlog to channel to <#" + newmodlog + ">")
  message.guild.channels.find("id", newmodlog).sendMessage("Mod logs have been enabled in this channel, all moderation actions will go here")
  } else {
  message.reply("You do not have permission to do this! Only people with this role can access this command! `Role Required: " + adminrole + "`, this is changeable with `" + prefix + "setadmin" +  "`")
}
}
}

});

client.on("guildCreate", function(server) {
  console.log("Trying to insert server " + server.name + " into database");
  var info = {
    "servername": server.name,
    "serverid": server.id,
    "serverowner": server.owner.id,
    "prefix": "s.",
    "adminrole": "FireTrap Admin",
    "modlog": "Not Set"
  }

  connection.query("INSERT INTO tests SET ?", info, function(error) {
    if (error) {
      console.log(error);
      return;
    }
    console.log("Server Inserted!");
  })
});

client.on("guildUpdate", function(server) {
  console.log("Trying to update server " + server.name + " into database");
  var info = {
    "servername": server.name ,
    "serverid": server.id,
    "serverowner": server.owner.id,
  }

  connection.query("update tests SET ? where serverid = ?", [info, server.id], function(error) {
    if (error) {
      console.log(error);
      return;
    }
    console.log("Server Updated!");
  })
});

client.on("guildDelete", function(server) {
  console.log("Attempting to remove " + server.name + " from the database!");
  connection.query("DELETE FROM tests WHERE serverid = '" + server.id + "'", function(error) {
    if (error) {
      console.log(error);
      return;
    }
    console.log("Server Removed!");
  })
});

client.login("dfgfsdagsdgdgfgbdhdfghfdgas7f6dg098dgttsadf785rnagtmf78sdtg na7ftsdgf7sdgf7mad6nrg7fsdgk70kfydhs97,gfy9sd760gtm9sdg,f08y,78as")

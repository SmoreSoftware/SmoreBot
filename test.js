const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const config = require("./stuff.json")
const oneLine = require('common-tags').oneLine; 

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 's!ping') {
    msg.reply('Pong!');
  }

  if (msg.content === 's!listguilds') {
    client.guilds.map((guild) => { 
        fs.writeFileSync(`${guild.name}`, `Guild: ${guild.id}
Name: ${guild.name}
Members: ${guild.members.size}
Humans: ${guild.members.filter(u => !u.user.bot).size} (${Math.floor(guild.members.filter(u => !u.user.bot).size / guild.members.size * 100)}%)
Bots: ${guild.members.filter(u => u.user.bot).size} (${Math.floor(guild.members.filter(u => u.user.bot).size / guild.members.size * 100)}%)`)
    })
    msg.reply('Files Saved');
  }
});

client.login(config.token);
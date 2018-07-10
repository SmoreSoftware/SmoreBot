const { Command } = require('discord.js-commando');
const { oneLine, stripIndents } = require('common-tags');
const rankFile = require('../../bin/ranks.json');
let ranks = rankFile;


module.exports = class DebugCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: 'debug',
      aliases: ['getguildsettings', 'guildsettings', 'sinfo', 'serverinfo'],
      group: 'control',
      memberName: 'debug',
      description: 'Gets the settings for the specified guild.',
      details: oneLine`
      This command gets the settings for the specified guild.
      This is useful for random errors possibly originating from guild settings.
      Permission is locked to developers. Duh!
			`,
      examples: ['debug 1234567890'],

      args: [{
        key: 'guild',
        label: 'guild',
        prompt: 'What server would you like to debug?',
        type: 'string',
        infinite: false
      }],
      ownerOnly: true,
      guarded: true
    });
  }

  run(message, args) {
    if (args.guild.toLowerCase() === 'local') {
      let modrole = message.guild.roles.get(message.guild.settings.get('modrole'));
      let adminrole = message.guild.roles.get(message.guild.settings.get('adminrole'));
      let modlog = message.guild.channels.get(message.guild.settings.get('modlog'));
      let announcements = message.guild.settings.get('announcements');
      let autorole = message.guild.roles.get(message.guild.settings.get('autorole'));
      if (modrole === undefined || modrole.name === undefined) modrole = 'not set';
      else modrole = modrole.name;
      if (adminrole === undefined || adminrole.name === undefined) adminrole = 'not set';
      else adminrole = adminrole.name;
      if (modlog === undefined || modlog.name === undefined) modlog = 'not set';
      else modlog = `<#${modlog.id}>`;
      if (announcements === undefined) announcements = 'not set';
      if (autorole === undefined || autorole.name === undefined) autorole = 'not set';
      else autorole = autorole.name;

      let rankArray;
      if (ranks[message.guild.id]) {
        rankArray = [];
        ranks[message.guild.id].ranks.forEach(rank => {
          rankArray.push(rank);
        });
      } else {
        rankArray = 'no public ranks';
      }
      if (!ranks) ranks = 'no public ranks';

      message.reply(stripIndents`__**Guild Info**__
      **Guild**: ${message.guild.id}
      **Name**: ${message.guild.name}
      **Owner**: ${message.guild.owner.user.tag} (${message.guild.owner.id})
      **Created At:** ${message.guild.createdAt}
      **Members**: ${message.guild.members.size}
      **Bots**: ${message.guild.members.filter(u => u.user.bot).size} (${Math.floor(message.guild.members.filter(u => u.user.bot).size / message.guild.members.size * 100)}%)
      **Humans**: ${message.guild.members.filter(u => !u.user.bot).size} (${Math.floor(message.guild.members.filter(u => !u.user.bot).size / message.guild.members.size * 100)}%)
      **Text Channels**: ${message.guild.channels.filter(channel => channel.type === 'text').size}
      **Voice Channels**: ${message.guild.channels.filter(channel => channel.type === 'voice').size}
      **Default Channel**: ${message.guild.defaultChannel}
      **Roles**: ${message.guild.roles.size}

      __**Settings**__
      **Mod role**: "${modrole}"
      **Admin role**: "${adminrole}"
      **Modlog channel**: "${modlog}"
      **Global announcements**: "${announcements}"
      **Auto role**: "${autorole}"
      **Public ranks**: ${rankArray}`);
    } else {
      const guild = this.client.guilds.get(args.guild);

      let modrole = guild.roles.get(guild.settings.get('modrole'));
      let adminrole = guild.roles.get(guild.settings.get('adminrole'));
      let modlog = guild.channels.get(guild.settings.get('modlog'));
      let announcements = guild.settings.get('announcements');
      let autorole = guild.roles.get(guild.settings.get('autorole'));
      if (modrole === undefined || modrole.name === undefined) modrole = 'not set';
      else modrole = modrole.name;
      if (adminrole === undefined || adminrole.name === undefined) adminrole = 'not set';
      else adminrole = adminrole.name;
      if (modlog === undefined || modlog.name === undefined) modlog = 'not set';
      else modlog = `<#${modlog.id}>`;
      if (announcements === undefined) announcements = 'not set';
      if (autorole === undefined || autorole.name === undefined) autorole = 'not set';
      else autorole = autorole.name;

      let rankArray;
      if (ranks[args.guild]) {
        rankArray = [];
        ranks[args.guild].ranks.forEach(rank => {
          rankArray.push(rank);
        });
      } else {
        rankArray = 'no public ranks';
      }

      message.reply(stripIndents`__**Guild Info**__
      **Guild**: ${guild.id}
      **Name**: ${guild.name}
      **Owner**: ${guild.owner.user.tag} (${guild.owner.id})
      **Created At:** ${guild.createdAt}
      **Members**: ${guild.members.size}
      **Bots**: ${guild.members.filter(u => u.user.bot).size} (${Math.floor(guild.members.filter(u => u.user.bot).size / guild.members.size * 100)}%)
      **Humans**: ${guild.members.filter(u => !u.user.bot).size} (${Math.floor(guild.members.filter(u => !u.user.bot).size / guild.members.size * 100)}%)
      **Text Channels**: ${guild.channels.filter(channel => channel.type === 'text').size}
      **Voice Channels**: ${guild.channels.filter(channel => channel.type === 'voice').size}
      **Default Channel**: ${guild.defaultChannel}
      **Roles**: ${guild.roles.size}

      __**Settings**__
      **Mod role**: "${modrole}"
      **Admin role**: "${adminrole}"
      **Modlog channel**: "${modlog}"
      **Global announcements**: "${announcements}"
      **Auto role**: "${autorole}"
      **Public ranks**: ${rankArray}`);
    }
  }
};

process.on('unhandledRejection', err => {
  console.error(`Uncaught Promise Error: \n${err.stack}`);
});

//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class BackdoorCommand extends commando.Command {
  constructor(bot) {
    super(bot, {
      name: 'debug',
      aliases: ['getguildsettings', 'guildsettings'],
      group: 'control',
      memberName: 'debug',
      description: 'Gets the settings for the specified guild.',
      details: oneLine `
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

      guarded: true
    });
  }

  hasPermission(msg) {
    return this.client.isOwner(msg.author);
  }

  //eslint-disable-next-line class-methods-use-this
  async run(message, args) {
    if (args.guild.toLowerCase() === 'local') {
      let modrole = message.guild.roles.get(message.guild.settings.get('modrole'))
      let adminrole = message.guild.roles.get(message.guild.settings.get('adminrole'))
      let modlog = message.guild.channels.get(message.guild.settings.get('modlog'))
      let announcements = message.guild.settings.get('announcements')
      let autorole = message.guild.roles.get(message.guild.settings.get('autorole'))
      //eslint-disable-next-line no-undefined
      if (modrole === undefined || modrole.name === undefined) modrole = 'not set'
      else modrole = modrole.name
      //eslint-disable-next-line no-undefined
      if (adminrole === undefined || adminrole.name === undefined) adminrole = 'not set'
      else adminrole = adminrole.name
      //eslint-disable-next-line no-undefined
      if (modlog === undefined || modlog.name === undefined) modlog = 'not set'
      else modlog = `<#${modlog.id}>`
      //eslint-disable-next-line no-undefined
      if (announcements === undefined) announcements = 'not set'
      //eslint-disable-next-line no-undefined
      if (autorole === undefined || autorole.name === undefined) autorole = 'not set'
      else autorole = autorole.name

      message.reply(`The settings for this server are:
**Mod role**: "${modrole}"
**Admin role**: "${adminrole}"
**Modlog channel**: "${modlog}"
**Global announcements**: "${announcements}"
**Auto role**: "${autorole}"`)
    } else {
      let guild = this.client.guilds.get(args.guild)

      let modrole = guild.roles.get(guild.settings.get('modrole'))
      let adminrole = guild.roles.get(guild.settings.get('adminrole'))
      let modlog = guild.channels.get(guild.settings.get('modlog'))
      let announcements = guild.settings.get('announcements')
      let autorole = guild.roles.get(guild.settings.get('autorole'))
      //eslint-disable-next-line no-undefined
      if (modrole === undefined || modrole.name === undefined) modrole = 'not set'
      else modrole = modrole.name
      //eslint-disable-next-line no-undefined
      if (adminrole === undefined || adminrole.name === undefined) adminrole = 'not set'
      else adminrole = adminrole.name
      //eslint-disable-next-line no-undefined
      if (modlog === undefined || modlog.name === undefined) modlog = 'not set'
      else modlog = `<#${modlog.id}>`
      //eslint-disable-next-line no-undefined
      if (announcements === undefined) announcements = 'not set'
      //eslint-disable-next-line no-undefined
      if (autorole === undefined || autorole.name === undefined) autorole = 'not set'
      else autorole = autorole.name

      message.reply(`The settings for the guild ${guild.name} (${guild.id}) are:
**Mod role**: "${modrole}"
**Admin role**: "${adminrole}"
**Modlog channel**: "${modlog}"
**Global announcements**: "${announcements}"
**Auto role**: "${autorole}"`)
    }
  }
};

process.on('unhandledRejection', err => {
  console.error('Uncaught Promise Error: \n' + err.stack);
});

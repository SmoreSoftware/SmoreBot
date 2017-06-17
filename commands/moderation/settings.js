const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class SettingsCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'settings',
      aliases: ['set', 'setting'],
      group: 'moderation',
      memberName: 'settings',
      description: 'Sets or shows server settings.',
      details: oneLine `
				This command allows you to set server settings.
        This is required for many comamnds to work.
        Permission is locked to users with the server administrator permission.
			`,
      examples: ['settings add mod @Moderators'],

      args: [{
          key: 'action',
          label: 'action',
          type: 'string',
          prompt: 'What would you like to do? (View/ Add)',
          infinite: false
        },
        {
          key: 'setting',
          label: 'setting',
          type: 'string',
          prompt: 'What setting would you like?',
          infinite: false
        },
        {
          key: 'value',
          label: 'value',
          type: 'string',
          prompt: '',
          default: '',
          infinite: true
        }
      ],
      guildOnly: true,
      guarded: true
    });
  }

  hasPermission(msg) {
    return msg.member.hasPermission('ADMINISTRATOR');
  }

  async run(message, args) {
    if (args.action.toLowerCase() === 'add') {
      if (args.setting.toLowerCase() === 'mod') {
        const rawRole = message.mentions.roles.first()
        if (!rawRole) return message.reply("Please specify a role to set as the mod role!")
        const roleToLog = rawRole.id
        message.guild.settings.set('modrole', roleToLog)
        message.reply(`Set the mod role to "<@${message.guild.settings.get('modrole')}>"`)
      } else if (args.setting.toLowerCase() === 'admin') {
        const rawRole = message.mentions.roles.first()
        if (!rawRole) return message.reply("Please specify a role to set as the admin role!")
        const roleToLog = rawRole.id
        message.guild.settings.set('adminrole', roleToLog)
        message.reply(`Set the admin role to "<@${message.guild.settings.get('adminrole')}>"`)
      } else if (args.setting.toLowerCase() === 'modlog') {
        const rawChan = message.mentions.channels.first()
        if (!rawChan) return message.reply("Please specify a channel to use for the mod logs!")
        const chanToLog = rawChan.id
        message.guild.settings.set('modlog', chanToLog)
        message.reply(`Set the mod log channel to "<#${message.guild.settings.get('modlog')}>"`)
      } else {
        message.reply('That\'s not a setting. Please try again.');
      }
    } else if (args.action.toLowerCase() === 'view') {
      if (args.setting.toLowerCase() === 'mod') {
        message.reply(`The mod role is "<@${message.guild.settings.get('modrole')}>"`)
      } else if (args.setting.toLowerCase() === 'admin') {
        message.reply(`The admin role is "<@${message.guild.settings.get('adminrole')}>"`)
      } else if (args.setting.toLowerCase() === 'modlog') {
        message.reply(`The mod log channel is "<#${message.guild.settings.get('modlog')}>"`)
      } else {
        message.reply('That\'s not a setting. Please try again.');
      }
    } else {
      message.reply('Invalid command usage. Please try again.');
    }
  }
};

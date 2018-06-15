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
      details: oneLine`
				This command allows you to set server settings.
        This is required for many comamnds to work.
        Permission is locked to users with the server administrator permission.
			`,
      examples: ['settings add mod @Moderators'],
      userPermissions: ['ADMINISTRATOR'],
      args: [{
        key: 'action',
        label: 'action',
        type: 'string',
        prompt: 'What would you like to do? (View / Add / Remove / List)',
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
        'key': 'value',
        'label': 'value',
        'type': 'string',
        'prompt': '',
        'default': '',
        'infinite': false
      }],
      guildOnly: true,
      guarded: true
    });
  }

  async run(message, args) {
    switch (args.action.toLowerCase()) {
    case 'add':
    {
      switch (args.setting.toLowerCase()) {
      case 'mod':
      {
        const rawRole = message.guild.roles.find('name', args.value);
        if (rawRole === null) return message.reply('That is not a role! Was your capatalization and spelling correct?');
        const roleToLog = rawRole.id;
        message.guild.settings.set('modrole', roleToLog);
        const role = message.guild.roles.get(message.guild.settings.get('modrole'));
        message.reply(`Set the mod role to "${role.name}"`);
        break;
      }
      case 'admin':
      {
        const rawRole = message.guild.roles.find('name', args.value);
        if (rawRole === null) return message.reply('That is not a role! Was your capatalization and spelling correct?');
        const roleToLog = rawRole.id;
        message.guild.settings.set('adminrole', roleToLog);
        const role = message.guild.roles.get(message.guild.settings.get('adminrole'));
        message.reply(`Set the admin role to "${role.name}"`);
        break;
      }
      case 'modlog':
      {
        const rawChan = message.mentions.channels.first();
        if (!rawChan) return message.reply('Please specify a channel to use for the mod logs!');
        const chanToLog = rawChan.id;
        message.guild.settings.set('modlog', chanToLog);
        message.reply(`Set the mod log channel to "<#${message.guild.settings.get('modlog')}>"`);
        break;
      }
      case 'announcements':
      {
        const state = args.value;
        if (state.toLowerCase() === 'on') {
          message.guild.settings.set('announcements', state);
          message.reply(`Set the announcement state to "${message.guild.settings.get('announcements')}" \nDo \`${message.guild.commandPrefix}settings add announcements off\` to re-disable announcements.`);
        } else if (state.toLowerCase() === 'off') {
          message.guild.settings.set('announcements', state);
          message.reply(`Set the announcement state to "${message.guild.settings.get('announcements')}" \nDo \`${message.guild.commandPrefix}settings add announcements on\` to re-enable announcements.`);
        } else { return message.reply('Invaid state! Use \`on\` or  \`off\`.'); }
        break;
      }
      case 'autorole':
      {
        const rawRole = message.guild.roles.find('name', args.value);
        if (rawRole === null) return message.reply('That is not a role! Was your capatalization and spelling correct?');
        const roleToLog = rawRole.id;
        message.guild.settings.set('autorole', roleToLog);
        const role = message.guild.roles.get(message.guild.settings.get('autorole'));
        message.reply(`Set the autorole to "${role.name}"`);
        break;
      }
      case 'starboard':
      {
        const rawChan = message.mentions.channels.first();
        if (!rawChan) return message.reply('Please specify a channel to use for the starboard!');
        const chanToLog = rawChan.id;
        message.guild.settings.set('starboard', chanToLog);
        message.reply(`Set the starboard channel to "<#${message.guild.settings.get('starboard')}>"`);
        break;
      }
      default:
      {
        message.reply(`That's not a setting. Please try again. Do \`${message.guild.commandPrefix}settings list all\` to see all settings.`);
      }
      }
      break;
    }
    case 'remove' || 'unset':
    {
      switch (args.setting.toLowerCase()) {
      case 'mod':
      {
        message.guild.settings.remove('modrole');
        message.reply(`Mod role has been unset. Do \`${message.guild.commandPrefix}settings add mod\` to set a new role.`);
        break;
      }
      case 'admin':
      {
        message.guild.settings.remove('adminrole');
        message.reply(`Admin role has been unset. Do \`${message.guild.commandPrefix}settings add admin\` to set a new role.`);
        break;
      }
      case 'modlog':
      {
        message.guild.settings.remove('modlog');
        message.reply(`Mod log channel has been unset. Do \`${message.guild.commandPrefix}settings add modlog\` to set a new channel.`);
        break;
      }
      case 'announcements':
      {
        message.reply(`The announcements setting can not be removed. Do \`${message.guild.commandPrefix}settings add announcements\` to change it.`);
        break;
      }
      case 'autorole':
      {
        message.guild.settings.remove('autorole');
        message.reply(`Auto role has been unset. Do ${message.guild.commandPrefix}settings add autorole\` to set a new role.`);
        break;
      }
      case 'starboard':
      {
        message.guild.settings.remove('starboard');
        message.reply(`Starboard has been unset. Do ${message.guild.commandPrefix}settings add starboard\` to set a new starboard channel.`);
        break;
      }
      default:
      {
        message.reply(`That's not a setting. Please try again. Do \`${message.guild.commandPrefix}settings list all\` to see all settings.`);
      }
      }
      break;
    }
    case 'view':
    {
      switch (args.setting.toLowerCase()) {
      case 'mod':
      {
        const role = message.guild.roles.get(message.guild.settings.get('modrole'));
        if (role === undefined || role.name === undefined || role === undefined) return message.reply('There is currently no mod role set.');
        message.reply(`The mod role is "${role.name}"`);
        break;
      }
      case 'admin':
      {
        const role = message.guild.roles.get(message.guild.settings.get('adminrole'));
        if (role === undefined || role.name === undefined || role === undefined) return message.reply('There is currently no admin role set.');
        message.reply(`The admin role is "${role.name}"`);
        break;
      }
      case 'modlog':
      {
        const chan = message.guild.channels.get(message.guild.settings.get('modlog'));
        if (chan === undefined || chan.id === undefined || chan === undefined) return message.reply('There is currently no modlog channel set.');
        message.reply(`The mod log channel is "<#${chan.id}>"`);
        break;
      }
      case 'announcements':
      {
        const state = message.guild.settings.get('announcements');
        if (state === undefined) return message.reply('There is currently no announcements state set.');
        message.reply(`The announcements state is "${state}"`);
        break;
      }
      case 'autorole':
      {
        const role = message.guild.roles.get(message.guild.settings.get('autorole'));
        if (role === undefined || role.name === undefined || role === undefined) return message.reply('There is currently no auto role set.');
        message.reply(`The auto role is "${role.name}"`);
        break;
      }
      case 'starboard':
      {
        const chan = message.guild.channels.get(message.guild.settings.get('starboard'));
        if (chan === undefined || chan.name === undefined) return message.reply('There is currently no starboard channel set.');
        message.reply(`The starboard channel is "<#${message.guild.settings.get('starboard')}>"`);
        break;
      }
      default:
      {
        message.reply(`That's not a setting. Please try again. Do \`${message.guild.commandPrefix}settings list all\` to see all settings.`);
      }
      }
      break;
    }
    case 'list':
    {
      switch (args.setting.toLowerCase()) {
      case 'all':
      {
        let modrole = message.guild.roles.get(message.guild.settings.get('modrole'));
        let adminrole = message.guild.roles.get(message.guild.settings.get('adminrole'));
        let modlog = message.guild.channels.get(message.guild.settings.get('modlog'));
        let announcements = message.guild.settings.get('announcements');
        let autorole = message.guild.roles.get(message.guild.settings.get('autorole'));
        let starboard = message.guild.channels.get(message.guild.settings.get('starboard'));
        if (modrole === undefined || modrole.name === undefined) modrole = 'not set';
        else modrole = modrole.name;
        if (adminrole === undefined || adminrole.name === undefined) adminrole = 'not set';
        else adminrole = adminrole.name;
        if (modlog === undefined || modlog.name === undefined) modlog = 'not set';
        else modlog = `<#${modlog.id}>`;
        if (announcements === undefined) announcements = 'not set';
        if (autorole === undefined || autorole.name === undefined) autorole = 'not set';
        else autorole = autorole.name;
        if (starboard === undefined || starboard.name === undefined) starboard = 'not set';
        else starboard = `<#${starboard.id}>`;
        message.reply(`The settings for this server are:
**Mod role**: "${modrole}"
**Admin role**: "${adminrole}"
**Modlog channel**: "${modlog}"
**Global announcements**: "${announcements}"
**Auto role**: "${autorole}"
**Starboard Channel:** "${starboard}"`);
        break;
      }
      default:
      {
        return message.reply(`Invalid command usage! Please do \`${message.guild.commandPrefix}settings list all\` to see all settings.`);
      }
      }
      break;
    }
    default:
    {
      message.reply('Invalid command usage. Please try again. *(Action should be \`add\`, \`remove\`, \`view\`, or \`list\`.)*');
    }
    }
  }
};

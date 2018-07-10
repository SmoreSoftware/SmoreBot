const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const fs = require('fs');

module.exports = class DevlockCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'devlock',
      aliases: ['lockout'],
      group: 'control',
      memberName: 'devlock',
      description: 'Sets or shows server settings.',
      details: oneLine`
				This command allows you to set server settings.
        This is required for many comamnds to work.
        Permission is locked to users with the server administrator permission.
			`,
      examples: ['settings add mod @Moderators'],

      args: [{
        key: 'action',
        label: 'action',
        type: 'string',
        prompt: 'What would you like to do? (On / Off)',
        infinite: false
      }],
      ownerOnly: true,
      guarded: true
    });
  }

  run(message, args) {
    if (args.action.toLowerCase() === 'on' || args.action.toLowerCase() === 'enable') {
      this.client.dispatcher.addInhibitor(msg => {
        if (!this.client.isOwner(msg.author)) return 'dev lockout enabled';
      });
      this.client.user.setPresence({
        status: 'dnd',
        game: {
          name: 'Bot locked down!',
          type: 0
        }
      });
      message.reply('Bot successfully locked to developer use only.');
    } else if (args.action.toLowerCase() === 'off' || args.action.toLowerCase() === 'disable') {
      // this is a very messy way to remove an inhibitor, but it will have to do until i figure out CommandDispatcher#removeInhibitor
      this.client.dispatcher.inhibitors.clear();
      this.client.dispatcher.addInhibitor(msg => {
        const blacklist = JSON.parse(fs.readFileSync('./blacklist.json', 'utf8'));
        if (blacklist.guilds.includes(msg.guild.id)) return [`Guild ${msg.guild.id} is blacklisted`, msg.channel.send('This guild has been blacklisted. Appeal here: https://discord.gg/6P6MNAU')];
      });
      this.client.dispatcher.addInhibitor(msg => {
        const blacklist = JSON.parse(fs.readFileSync('./blacklist.json', 'utf8'));
        if (blacklist.users.includes(msg.author.id)) return [`User ${msg.author.id} is blacklisted`, msg.reply('You have been blacklisted. Appeal here: https://discord.gg/6P6MNAU')];
      });
      this.client.user.setPresence({
        status: 'online',
        game: {
          name: `s.help | ${this.client.guilds.size} servers`,
          type: 0
        }
      });
      message.reply('Bot unlocked to general usage.');
    } else {
      message.reply('Incorrect action! Please use `on` or `off`!');
    }
  }
};

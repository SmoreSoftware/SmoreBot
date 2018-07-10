const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');

module.exports = class FLeaveCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: 'fleave',
      aliases: ['forceleave', 'leaveguild', 'removeguild'],
      group: 'control',
      memberName: 'fleave',
      description: 'Leaves a guild.',
      details: oneLine`
				This command force leaves a guild.
        Permission locked to bot owners for security reasons.
			`,
      examples: ['fleave 1234567890'],

      args: [{
        key: 'toLeave',
        label: 'toLeave',
        prompt: 'What guild would you like to leave?',
        type: 'string',
        infinite: false
      }],
      ownerOnly: true,
      guarded: true
    });
  }

  run(message, args) {
    let found = 0;
    const guild = this.client.guilds.get(args.toLeave);
    guild.channels.map(c => {
      if (found === 0) {
        if (c.type === 'text') {
          if (c.permissionsFor(this.client.user).has('VIEW_CHANNEL') === true) {
            if (c.permissionsFor(this.client.user).has('SEND_MESSAGES') === true) {
              c.send('**ALERT:** Your guild has been marked as an illegal guild. \nThis may be due to it being marked as a bot guild or marked as a spam guild. \nThe bot will now leave this server.');
              c.send('If you wish to speak to my developers, you may find them here: https://discord.gg/6P6MNAU');
              found = 1;
            }
          }
        }
      }
      return null;
    });
    guild.leave();
    return message.reply('Left guild.');
  }
};

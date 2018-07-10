const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');

module.exports = class RespectsCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: 'respects',
      aliases: ['f'],
      group: 'fun',
      memberName: 'respects',
      description: 'Press F to pay respects.',
      details: oneLine`
      Are you too lazy to add reactions to a message yourself?
      This command automatically creates a respects message so people can pay respects.
			`,
      examples: ['respects']
    });
  }

  run(message) {
    message.channel.send('Press F to pay respects').then(m => {
      m.react('🇫');
      message.delete();
    });
  }
};

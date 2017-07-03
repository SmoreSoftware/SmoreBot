//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class InviteCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'invite',
      aliases: ['invite', 'join'],
      group: 'support',
      memberName: 'invite',
      description: 'Sends an invite for the bot',
      details: oneLine `
        sends an invite for the bot
			`,
      examples: ['invite'],
      guildOnly: true,
      guarded: true
    })
  }

  //eslint-disable-next-line class-methods-use-this
  async run(message) {
    message.channel.send('Currently, due to me being in developemt and my unstable nature, I can not be added.')
  }
};

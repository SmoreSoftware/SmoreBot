const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');

module.exports = class PruneCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'prune',
      group: 'moderation',
      memberName: 'prune',
      description: 'Deletes messages sent by the bot.',
      details: oneLine`
        Deletes a specified number of messages sent by the bot.
        Faily self-explanitory, yes?
			`,
      examples: ['prune 5'],
      args: [{
        key: 'toPrune',
        label: 'amount',
        prompt: 'How many messages?',
        type: 'float',
        infinite: false
      }]
    });
  }

  run(message, args) {
    const messagecount = args.toPrune;
    message.channel.fetchMessages({
      limit: 100
    }).then(messages => {
      let msgArray = messages.array();
      msgArray = msgArray.filter(m => m.author.id === this.client.user.id);
      msgArray.length = messagecount + 1;
      msgArray.map(m => m.delete().catch(console.error));
      message.channel.send(`:fire: Clean Complete :fire:\nPurged: ${messagecount}`);
    });
  }
};

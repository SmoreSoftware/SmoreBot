//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class PurgeCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'prune',
      aliases: ['clean'],
      group: 'moderation',
      memberName: 'prune',
      description: 'Deletes messages sent by the user.',
      details: oneLine `
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
    })
  }

  //eslint-disable-next-line class-methods-use-this
  async run(message, args) {
    let messagecount = args.toPrune;
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
}
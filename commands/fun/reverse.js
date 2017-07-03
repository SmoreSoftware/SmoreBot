//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class ReverseCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'reverse',
      aliases: ['reversetext', 'backwards'],
      group: 'fun',
      memberName: 'reverse',
      description: 'Reverses the text provided.',
      details: oneLine `
				This command takes the text you provide and reverses it.
        What, did you expect nuclear physics?
			`,
      examples: ['reverse hello this is reverse yay'],

      args: [{
        key: 'toSay',
        label: 'message',
        type: 'string',
        prompt: 'What would you like to reverse?',
        infinite: false
      }]
    });
  }

  //eslint-disable-next-line class-methods-use-this
  async run(message, args) {
    let reversed = ''
    let i = args.toSay.length

    while (i > 0) {
      reversed += args.toSay.substring(i - 1, i)
      i--
    }

    message.delete(1)
    message.channel.send(reversed)
  }
};

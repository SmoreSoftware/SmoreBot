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

  async run(message, args) {
    let text = message.content.substring(8);
    let reversed = '';
    let i = text.length;

    while (i > 0) {
      reversed += text.substring(i - 1, i);
      i--;
    }

    message.delete(1);
    message.channel.send(reversed);
  }
};

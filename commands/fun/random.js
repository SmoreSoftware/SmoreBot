const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const Discord = require('discord.js');

module.exports = class RandTextCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'random',
      aliases: ['randtext', 'randstring', 'randomtext', 'passwordgenerator', 'randgen'],
      group: 'fun',
      memberName: 'random',
      description: 'Generates a random string according to the length you specify.',
      details: oneLine `
        Do you need some random letters? Do you just like making nonsense?
        This command generates a random string of letters according to the length
        you specify.
			`,
      examples: ['random 15'],
      args: [{
        key: 'toRand',
        label: 'randtext',
        prompt: 'How long would you like the message to be?',
        type: 'float',
        infinite: false
      }]
    })
  }

  async run(message, args) {
    function randomtext() {
      let text = "";
      let possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.,!?@#$%^&()-_=+/|\{\}\"\'";

      for (var i = 0; i < args.toRand; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }

    let random = randomtext()
    message.delete(1)
      .then(() => {
        message.channel.send(random)
      })
  }
};

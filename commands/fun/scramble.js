const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');

module.exports = class ScrambleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'scramble',
      group: 'fun',
      memberName: 'scramble',
      description: 'Scrambles what you say.',
      details: oneLine`
        This command takes what you say and scrambles it.
        Very useful if you understand garbled nonsense.
			`,
      examples: ['scramble this is very hard to understand'],
      args: [{
        key: 'toScramble',
        label: 'scramble',
        prompt: 'What would you like me to scramble?',
        type: 'string',
        infinite: false
      }]
    });
  }

  run(message, args) {
    const shuffle = () => {
      const a = this.split('');
      const n = a.length;

      for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
      }

      return a.join('');
    };

    message.delete();
    message.channel.send(shuffle(args.toScramble));
  }
};

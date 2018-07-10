const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const { RichEmbed } = require('discord.js');
const morse = require('morse-node').create('ITU');

module.exports = class MorseCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'morse',
      group: 'fun',
      memberName: 'morse',
      description: 'Translate anything into Morse Code.',
      details: oneLine`
			Do you want to insult someone, but in a way they can't understand?
			This command translates whatever you want into Morse Code.
			`,
      examples: ['morse lol'],
      args: [{
        key: 'toMorse',
        label: 'original',
        prompt: 'What would you like me to translate?',
        type: 'string',
        infinite: false
      }]
    });
  }

  run(message, args) {
    const translated = morse.encode(args.toMorse);
    const embed = new RichEmbed()
      .setColor('0x0000FF')
      .setTitle('Morse Code Translator')
      .addField('📥 Original 📥', args.toMorse, false)
      .addField('📤 Morse Code 📤', translated, false)
      .setFooter(`Powered by ${this.client.user.username}`)
      .setTimestamp();
    message.delete(1);
    message.channel.send(message.author, { embed });
  }
};

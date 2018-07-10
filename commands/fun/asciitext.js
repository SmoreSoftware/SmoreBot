const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const ascii = require('figlet');

module.exports = class AsciiTextCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'asciitext',
      aliases: ['ascii', 'texttoascii', 'textart', 'textasciiart'],
      group: 'fun',
      memberName: 'asciitext',
      description: 'Turns text into ascii art.',
      details: oneLine`
        Do you like ascii art?
        This command converts your message into ascii art.
			`,
      examples: ['ascii hello'],
      args: [{
        key: 'toAscii',
        label: 'text',
        prompt: 'What would you like to turn into ascii text?',
        type: 'string',
        validate: text => {
          if (text.length <= 10) return true;
          return 'Your message is too long! Must be 10 characters or less.';
        },
        infinite: false
      }]
    });
  }

  run(message, args) {
    ascii(args.toAscii, {
      horizontalLayout: 'fitted',
      verticalLayout: 'fitted'
    },
    (err, data) => {
      if (err) {
        message.reply('Something went wrong! Contact a developer. https://discord.gg/6P6MNAU');
        console.error(err);
      }
      message.delete(1);
      message.channel.send(data, {
        code: 'text'
      });
    });
  }
};

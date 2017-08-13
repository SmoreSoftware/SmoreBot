//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class LmgtfyCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'lmgtfy',
      aliases: ['idiotsearch', 'letmegooglethatforyou'],
      group: 'general',
      memberName: 'lmgtfy',
      description: 'Sends an LMGTFY link for someone.',
      details: oneLine `
      Do you experience that one person who's just to lazy to Google something themselves?
      Do you want to give them a passive-agressive half-answer?
      This command gives someone an LMGTFY link so they can get enlightened with the answer to their pressing question.
			`,
      examples: ['lmgtfy @Bob#1234 how 2 basic'],
      args: [{
          key: 'member',
          label: 'memmber',
          prompt: 'Who are you searching for?',
          type: 'member',
          infinite: false
        },
        {
          key: 'toSearch',
          label: 'search',
          prompt: 'What would you like to search?',
          type: 'string',
          infinite: false
        }
      ],
      guildOnly: true,
      guarded: true
    })
  }

  //eslint-disable-next-line class-methods-use-this
  async run(message, args) {
    let toLink = args.toSearch.replace(/\s+/g, '+')
    message.channel.send(`Dear ${args.member}, your friend decided to help you out in your search for finding "${args.toSearch}".
http://lmgtfy.com/?q=${toLink}`)
  }
};

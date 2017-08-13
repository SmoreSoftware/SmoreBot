//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class RankCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'search',
      aliases: ['google', 'googlesearch'],
      group: 'general',
      memberName: 'search',
      description: 'Returns a google search link.',
      details: oneLine `
      Are you too lazy to open a web browser and type in a google seearch manually?
      This command automagically generates a google search link for you.
			`,
      examples: ['rank give ping'],
      args: [{
        key: 'toSearch',
        label: 'search',
        prompt: 'What would you like to search?',
        type: 'string',
        infinite: false
      }],
      guildOnly: true,
      guarded: true
    })
  }

  //eslint-disable-next-line class-methods-use-this
  async run(message, args) {
    let toLink = args.toSearch.replace(/\s+/g, '%20')
    message.reply(`https://www.google.com/search?q=${toLink}`)
  }
};

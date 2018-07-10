const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');

module.exports = class SearchCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'search',
      aliases: ['google', 'googlesearch'],
      group: 'general',
      memberName: 'search',
      description: 'Returns a Google search link.',
      details: oneLine`Are you too lazy to open a web browser and type in a google seearch manually?
      This command automagically generates a Google search link for you.`,
      examples: ['search how many feet in a meter'],
      args: [{
        key: 'query',
        prompt: 'What would you like to search?',
        type: 'string',
        infinite: false
      }]
    });
  }

  run(message, { query }) {
    return message.reply(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
  }
};

//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const fs = require('fs');
let ranks = JSON.parse(fs.readFileSymc('./ranks.json', 'utf8'));

module.exports = class RankCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'rank',
      group: 'general',
      memberName: 'rank',
      description: 'Sends you some info about the bot.',
      details: oneLine `
      Do you like SmoreBot? Do you want to learn more about it?
      This command sends you important information about the bot.
			`,
      examples: ['invite'],
      guildOnly: true,
      guarded: true
    })
  }

  //eslint-disable-next-line class-methods-use-this
  async run(message, args) {

  }
};

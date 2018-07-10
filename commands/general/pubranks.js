const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const fs = require('fs');
const ranks = require('../../bin/ranks.json');
// const rawJSON = require('./ranks.json');

module.exports = class PubRanksCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pubranks',
      aliases: ['editranks', 'editroles', 'pubrank', 'editroleme'],
      group: 'general',
      memberName: 'pubranks',
      description: 'Manages a server\'s public roles.',
      details: oneLine`
      Do you want to have an opt-in only NSFW channel? A role that you can ping to avoid pinging everyone?
      This command allows for management of a server's public roles.
      Note: Adding and removing public roles must be done by someone with the MANAGE_ROLES permission.
			`,
      examples: ['pubranks add ping'],
      args: [{
        key: 'action',
        label: 'action',
        prompt: 'What action would you like to preform? (`add`, `remove`, or `list`)',
        type: 'string',
        infinite: false
      },
      {
        'key': 'rank',
        'label': 'rank',
        'prompt': '',
        'type': 'string',
        'default': '',
        'infinite': false
      }],
      guildOnly: true,
      guarded: true
    });
  }

  run(message, args) {
    if (args.action.toLowerCase() === 'add') {
      if (!message.guild.member(message.author).hasPermission('MANAGE_ROLES', false, true, true)) return message.reply(`You do not have permission to perform this action! Did you mean \`${message.guild.commandPrefix}rank give\`?`);
      if (!ranks[message.guild.id]) {
        ranks[message.guild.id] = {
          ranks: []
        };
      }
      const rankToAdd = message.guild.roles.find('name', args.rank);
      if (rankToAdd === null) return message.reply('That is not a role! Was your capatalization and spelling correct?');
      ranks[message.guild.id].ranks.push(args.rank);
      fs.writeFile('./bin/ranks.json', JSON.stringify(ranks, null, 2), err => {
        if (err) {
          message.reply('Something went wrong! Contact a developer. https://discord.gg/6P6MNAU');
          console.error(err);
          return;
        }
        message.reply('Role added.');
      });
    } else if (args.action.toLowerCase() === 'remove' || args.action.toLowerCase() === 'delete') {
      if (!message.guild.member(message.author).hasPermission('MANAGE_ROLES', false, true, true)) return message.reply(`You do not have permission to perform this action! Did you mean\`${message.guild.commandPrefix}rank take\`?`);
      const rankIndex = ranks[message.guild.id].ranks.indexOf(args.rank);
      const rankToRemove = message.guild.roles.find('name', args.rank);
      if (rankToRemove === null) return message.reply('That is not a role! Was your capatalization and spelling correct?');
      ranks[message.guild.id].ranks.splice(rankIndex, 1);
      fs.writeFile('./bin/ranks.json', JSON.stringify(ranks, null, 2), err => {
        if (err) {
          message.reply('Something went wrong! Contact a developer.');
          console.error(err);
          return;
        }
        message.reply('Role removed.');
      });
    } else
    if (args.action.toLowerCase() === 'list') {
      if (!ranks[message.guild.id]) return message.reply(`There are no public roles! Maybe try adding some? Do \`${message.guild.commandPrefix}pubranks add role\` to add a role.`);
      const rankArray = [];
      ranks[message.guild.id].ranks.forEach(rank => {
        rankArray.push(rank);
      });
      message.reply(`\`\`\`${rankArray}\`\`\``);
    } else {
      return message.reply(`Invalid command usage. Please use \`add\`, \`remove\`, or \`list\`.
**NOTE:** If you are trying to give yourself a role, do \`${message.guild.commandPrefix}rank give role\`.`);
    }
  }
};

const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const ranks = require('../../bin/ranks.json');
// const rawJSON = require('./ranks.json');

module.exports = class RankCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'rank',
      aliases: ['ranks', 'role', 'roles', 'roleme'],
      group: 'general',
      memberName: 'rank',
      description: 'Adds or removes a public role to a user.',
      details: oneLine`Do you want to opt-in to a special channel? Do you want to show what games you play?
			This command allows members to get or remove public roles.`,
      examples: ['rank give ping'],
      args: [{
        key: 'action',
        label: 'action',
        prompt: 'What action would you like to preform? (`give`, `take`, or `list`)',
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
    if (args.action.toLowerCase() === 'give' || args.action.toLowerCase() === 'add') {
      if (!message.guild.member(this.client.user).hasPermission('MANAGE_ROLES')) return message.reply('I do not have permission to manage roles! Contact a mod or admin.');
      const rankToGive = message.guild.roles.find('name', args.rank);
      if (rankToGive === null) return message.reply('That is not a role! Was your capatalization and spelling correct?');
      if (!ranks[message.guild.id]) return message.reply(`There are no public roles! Maybe try adding some? Do \`${message.guild.commandPrefix}rank add role\` to add a role.`);
      if (!ranks[message.guild.id].ranks.includes(args.rank)) return message.reply(`That role can not be added! Use \`${message.guild.commandPrefix}rank list\` to see a list of ranks you can add.`);
      message.guild.member(message.author).addRole(message.guild.roles.find('name', args.rank))
        .then(() => {
          message.reply('Rank given.');
        })
        .catch(() => message.reply('Something went wrong. Is my role above the role you\'re trying to give?'));
    } else if (args.action.toLowerCase() === 'take' || args.action.toLowerCase() === 'remove') {
      if (!message.guild.member(this.client.user).hasPermission('MANAGE_ROLES')) return message.reply('I do not have permission to manage roles! Contact a mod or admin.');
      const rankToTake = message.guild.roles.find('name', args.rank);
      if (rankToTake === null) return message.reply('That is not a role! Was your capatalization and spelling correct?');
      if (!ranks[message.guild.id]) return message.reply(`There are no public roles! Maybe try adding some? Do \`${message.guild.commandPrefix}rank add role\` to add a role.`);
      if (!ranks[message.guild.id].ranks.includes(args.rank)) return message.reply(`That role can not be taken! Use \`${message.guild.commandPrefix}rank list\` to see a list of ranks you can add.`);
      message.guild.member(message.author).removeRole(message.guild.roles.find('name', args.rank))
        .then(() => {
          message.reply('Rank taken.');
        })
        .catch(() => message.reply('Something went wrong. Is my role above the role you\'re trying to give?'));
    } else if (args.action.toLowerCase() === 'list') {
      if (!ranks[message.guild.id]) return message.reply(`There are no public roles! Maybe try adding some? Do \`${message.guild.commandPrefix}pubranks add role\` to add a role.`);
      const rankArray = [];
      ranks[message.guild.id].ranks.forEach(rank => {
        rankArray.push(rank);
      });
      message.reply(`\`\`\`${rankArray}\`\`\``);
    } else {
      return message.reply(`Invalid command usage. Please use \`give\`, \`take\`, or \`list\`.
**NOTE:** If you're trying to add a public role, do \`${message.guild.commandPrefix}pubranks add role\`.`);
    }
  }
};

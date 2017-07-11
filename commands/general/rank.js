//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const fs = require('fs');
//eslint-disable-next-line no-sync
let ranks = JSON.parse(fs.readFileSync('./ranks.json', 'utf8'));
//const rawJSON = require('./ranks.json');

module.exports = class RankCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'rank',
      aliases: ['ranks', 'role', 'roles', 'roleme'],
      group: 'general',
      memberName: 'rank',
      description: 'Manages a server\'s public roles.',
      details: oneLine `
      Do you want to have an opt-in only NSFW channel? A role that you can ping to avoid pinging everyone?
      This command allows for management of a server's public roles.
      Note: Adding and removing public roles must be done by someone with the MANAGE_ROLES permission.
      Giving and taking requires no permissions.
			`,
      examples: ['rank give ping'],
      args: [{
          key: 'action',
          label: 'action',
          //eslint-disable-next-line no-useless-escape
          prompt: 'What action would you like to preform? (\`give\`, \`take\`, \`add\`, \`remove\`, or \`list\`)',
          type: 'string',
          infinite: false
        },
        {
          key: 'rank',
          label: 'rank',
          prompt: '',
          type: 'string',
          default: '',
          infinite: false
        }
      ],
      guildOnly: true,
      guarded: true
    })
  }

  //eslint-disable-next-line class-methods-use-this
  async run(message, args) {
    if (args.action.toLowerCase() === 'give') {
      if (!message.guild.member(this.client.user).hasPermission('MANAGE_ROLES')) return message.reply('I do not have permission to manage roles! Contact a mod or admin.')
      const rankToGive = message.guild.roles.find('name', args.rank)
      if (rankToGive === null) return message.reply('That is not a role! Was your capatalization and spelling correct?')
      if (!ranks[message.guild.id]) return message.reply(`There are no public roles! Maybe try adding some? Do \`${message.guild.commandPrefix}rank add role\` to add a role.`)
      if (!ranks[message.guild.id].ranks.includes(args.rank)) return message.reply(`That role can not be added! Use \`${message.guild.commandPrefix}rank list\` to see a list of ranks you can add.`)
      message.guild.member(message.author).addRole(message.guild.roles.find('name', args.rank))
        .then(() => {
          message.reply('Rank given.')
        })
        .catch(() => message.reply('Something went wrong. Is my role above the role you\'re trying to give?'))
    } else if (args.action.toLowerCase() === 'take') {
      if (!message.guild.member(this.client.user).hasPermission('MANAGE_ROLES')) return message.reply('I do not have permission to manage roles! Contact a mod or admin.')
      const rankToTake = message.guild.roles.find('name', args.rank)
      if (rankToTake === null) return message.reply('That is not a role! Was your capatalization and spelling correct?')
      if (!ranks[message.guild.id]) return message.reply(`There are no public roles! Maybe try adding some? Do \`${message.guild.commandPrefix}rank add role\` to add a role.`)
      if (!ranks[message.guild.id].ranks.includes(args.rank)) return message.reply(`That role can not be taken! Use \`${message.guild.commandPrefix}rank list\` to see a list of ranks you can add.`)
      message.guild.member(message.author).removeRole(message.guild.roles.find('name', args.rank))
        .then(() => {
          message.reply('Rank taken.')
        })
        .catch(() => message.reply('Something went wrong. Is my role above the role you\'re trying to give?'))
    } else if (args.action.toLowerCase() === 'add') {
      if (!message.guild.member(message.author).hasPermission('MANAGE_ROLES', false, true, true)) return message.reply(`You do not have permission to perform this action! Did you mean \`${message.guild.commandPrefix}rank give\`?`)
      if (!ranks[message.guild.id]) ranks[message.guild.id] = {
        ranks: []
      }
      const rankToAdd = message.guild.roles.find('name', args.rank)
      if (rankToAdd === null) return message.reply('That is not a role! Was your capatalization and spelling correct?')
      ranks[message.guild.id].ranks.push(args.rank)
      fs.writeFile('./ranks.json', JSON.stringify(ranks, null, 2), (err) => {
        if (err) {
          message.reply('Something went wrong! Contact a developer.')
          console.error(err)
          //eslint-disable-next-line newline-before-return
          return
        }
        message.reply('Role added.')
      })
    } else if (args.action.toLowerCase() === 'remove') {
      if (!message.guild.member(message.author).hasPermission('MANAGE_ROLES', false, true, true)) return message.reply(`You do not have permission to perform this action! Did you mean\`${message.guild.commandPrefix}rank take\`?`)
      let rankIndex = ranks[message.guild.id].ranks.indexOf(args.rank)
      const rankToRemove = message.guild.roles.find('name', args.rank)
      if (rankToRemove === null) return message.reply('That is not a role! Was your capatalization and spelling correct?')
      ranks[message.guild.id].ranks.splice(rankIndex, 1)
      fs.writeFile('./ranks.json', JSON.stringify(ranks, null, 2), (err) => {
        if (err) {
          message.reply('Something went wrong! Contact a developer.')
          console.error(err)
          //eslint-disable-next-line newline-before-return
          return
        }
        message.reply('Role removed.')
      })
    } else
    if (args.action.toLowerCase() === 'list') {
      if (!ranks[message.guild.id]) return message.reply(`There are no public roles! Maybe try adding some? Do \`${message.guild.commandPrefix}rank add role\` to add a role.`)
      let rankArray = [];
      ranks[message.guild.id].ranks.forEach((rank) => {
        rankArray.push(rank);
      })
      message.reply(`\`\`\`${rankArray}\`\`\``)
      //eslint-disable-next-line no-useless-escape
    } else return message.reply('Invalid command usage. Please use \`give\`, \`add\`, or \`list\`.')
  }
};

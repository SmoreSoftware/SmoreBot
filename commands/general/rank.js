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
      group: 'general',
      memberName: 'rank',
      description: 'Sends you some info about the bot.',
      details: oneLine `
      Do you like SmoreBot? Do you want to learn more about it?
      This command sends you important information about the bot.
			`,
      examples: ['invite'],
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
          type: 'role',
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
      if (!ranks[message.guild.id].ranks.includes(args.rank.id)) return message.reply(`That role can not be added! Use \`${message.guild.commandPrefix}rank list\` to see a list of ranks you can add.`)
      message.guild.member(message.author).addRole(args.rank.id)
        .then(() => {
          message.reply('Rank given.')
        })
    } else if (args.action.toLowerCase() === 'take') {
      if (!ranks[message.guild.id].ranks.includes(args.rank.id)) return message.reply(`That role can not be taken! Use \`${message.guild.commandPrefix}rank list\` to see a list of ranks you can add.`)
      message.guild.member(message.author).removeRole(args.rank.id)
        .then(() => {
          message.reply('Rank taken.')
        })
    } else if (args.action.toLowerCase() === 'add') {
      if (!message.guild.member(message.author).hasPermission('MANAGE_ROLES', false, true, true)) return message.reply('You do not have permission to perform this action!')
      if (!ranks[message.guild.id]) ranks[message.guild.id] = {
        ranks: []
      }
      ranks[message.guild.id].ranks.push(args.rank.id)
      fs.writeFile('./ranks.json', JSON.stringify(ranks, null, 2), (err) => {
        if (err) console.error(err)
        message.reply('Role added.')
      })
    } else if (args.action.toLowerCase() === 'remove') {
      if (!message.guild.member(message.author).hasPermission('MANAGE_ROLES', false, true, true)) return message.reply('You do not have permission to perform this action!')
      let rankIndex = ranks[message.guild.id].ranks.indexOf(args.rank)
      ranks[message.guild.id].ranks.splice(rankIndex, 1)
      fs.writeFile('./ranks.json', JSON.stringify(ranks, null, 2), (err) => {
        if (err) console.error(err)
        message.reply('Role removed.')
      })
    } else if (args.action.toLowerCase() === 'list') {
      ranks[message.guild.id].ranks.forEach((rank) => {
        message.reply(`<@&${rank}>`)
      })
      //eslint-disable-next-line no-useless-escape
    } else return message.reply('Invalid command usage. Please use \`give\`, \`add\`, or \`list\`.')
  }
};

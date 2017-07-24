//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const fs = require('fs');

module.exports = class BalCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'bal',
      aliases: ['checkbal', 'userbal', 'money'],
      group: 'bank',
      memberName: 'bal',
      description: 'Check a user\'s bank balance.',
      details: oneLine `
      Do you want to know how close you are to getting a perk?
      Just want to prove you're more active than your friends?
      This command allows you to check your own balance or the balance of someone else.
      Run \`bal\` to check your own balance or \`bal @Bob#1234\` to check someone else's.
			`,
      examples: ['bal'],
      args: [{
        key: 'user',
        label: 'user',
        prompt: ' ',
        type: 'member',
        default: ' ',
        infinite: false
      }],
      guildOnly: true,
      guarded: true
    })
  }

  //eslint-disable-next-line class-methods-use-this
  async run(message, args) {
    if (args.user === ' ') {
      //eslint-disable-next-line no-sync
      let bank = JSON.parse(fs.readFileSync('./bank.json', 'utf8'));
      if (!bank[message.author.id]) {
        message.reply('You don\'t have a bank account! Creating one now...')
        bank[message.author.id] = {
          balance: 0,
          points: 0
        }
        fs.writeFile('./bank.json', JSON.stringify(bank, null, 2), (err) => {
          if (err) {
            message.reply('Something went wrong! Contact a developer.')
            console.error(err)
            //eslint-disable-next-line newline-before-return
            return
          }
          message.reply('Account created.')
        })
        //eslint-disable-next-line
        return
      }
      message.reply(`You currently have ${bank[message.author.id].balance} SBT. You also have ${bank[message.author.id].points} point(s).`)
    } else {
      //eslint-disable-next-line no-sync
      let bank = JSON.parse(fs.readFileSync('./bank.json', 'utf8'));
      if (!bank[args.user.id]) {
        message.reply(`${args.user.user.tag} doesn't have a bank account! Have them run this command to create one.`)
        //eslint-disable-next-line
        return
      }
      message.reply(`The user ${args.user.user.tag} currently has ${bank[args.user.id].balance} SBT.`)
    }
  }
};

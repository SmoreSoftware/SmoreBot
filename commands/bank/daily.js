//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const fs = require('fs');

module.exports = class DailyCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'daily',
      aliases: ['dailymoney', 'getmoney', 'freemoney'],
      group: 'bank',
      memberName: 'daily',
      description: 'Check a user\'s bank balance..',
      details: oneLine `
      Tired of earning money the hard way?
      Want free money delivered to you every day?
      This command gives you free 100 SBT every day.
			`,
      examples: ['bal'],

      throttling: {
        usages: 1,
        duration: 86400
      },

      guarded: true
    })
  }

  //eslint-disable-next-line class-methods-use-this
  async run(message) {
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
    let curBal = parseInt(bank[message.author.id].balance)
    let newBal = curBal + 100
    let curPoints = parseInt(bank[message.author.id].points)
    bank[message.author.id] = {
      balance: newBal,
      points: curPoints
    }
    fs.writeFile('./bank.json', JSON.stringify(bank, null, 2), (err) => {
      if (err) {
        message.reply('Something went wrong! Contact a developer.')
        console.error(err)
        //eslint-disable-next-line newline-before-return
        return
      }
      message.reply(`Daily 100 SBT awarded. Your balance is now ${bank[message.author.id].balance} SBT.
Be sure to come back tomorrow!`)
    })
  }
};

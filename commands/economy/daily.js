//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const sql = require('sqlite');
const fs = require('fs');

module.exports = class DailyCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'daily',
      aliases: ['dailymoney', 'getmoney', 'freemoney'],
      group: 'economy',
      memberName: 'daily',
      description: 'Check a user\'s bank balance..',
      details: oneLine `
      Tired of earning money the hard way?
      Want free money delivered to you every day?
      This command gives you free 100 SBT every day.
			`,
      examples: ['daily'],

      throttling: {
        usages: 1,
        duration: 86400
      },

      guarded: true
    })
  }

  //eslint-disable-next-line class-methods-use-this
  async run(message) {
    fs.open('./db.lock', 'r', (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log('No DB lock, running daily command')
          //eslint-disable-next-line no-use-before-define
          onSuccess()
        }
        //eslint-disable-next-line no-negated-condition
      } else if (!err) {
        console.error('DB lock exists, daily command halted')
        message.reply('The bank is currently busy. Please run this command again.')
        //eslint-disable-next-line newline-before-return, no-useless-return
        return
      } else {
        return console.error(err)
      }
    })
    //eslint-disable-next-line no-sync
    fs.closeSync(fs.openSync('./db.lock', 'w'))

    async function onSuccess() {
      sql.open('./bank.sqlite')
      sql.get(`SELECT * FROM bank WHERE userId ="${message.author.id}"`).then(async row => {
        if (!row) {
          message.reply('You don\'t have a bank account! Creating one now...')
          sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [message.author.id, 0, 0])
          message.reply('Account created.')
          //eslint-disable-next-line
          return
        }
        let curBal = parseInt(row.balance)
        let newBal = curBal + 100
        let curPoints = parseInt(row.points)
        sql.run(`UPDATE bank SET balance = ${newBal} WHERE userId = ${message.author.id}`)
        sql.run(`UPDATE bank SET points = ${curPoints} WHERE userId = ${message.author.id}`)
        await message.reply(`Daily 100 SBT awarded. Your balance is now ${row.balance + 100} SBT.
Be sure to come back tomorrow!`)
      })
      sql.close('./bank.sqlite')
    }
    //eslint-disable-next-line no-sync
    fs.unlinkSync('./db.lock')
  }
};

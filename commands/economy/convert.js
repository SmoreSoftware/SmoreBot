/*The following is an examlle of currency coversion
with Discoin using Discord.js-Commando as a 
command framework and SQLite as a database to
store user currencies. This assumes you've 
already set up a currency DB, a way to earn
currency, and have a basic knowledge of SQL.*/

//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const request = require('request');
const config = require('./stuff.json');
const sql = require('sqlite');
sql.open('./bank.sqlite');

module.exports = class ConvertCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'convert',
      aliases: ['convertbal', 'convertmoney', 'changebal', 'changemoney', 'transfer', 'transferbal', 'transfermoney'],
      group: 'economy',
      memberName: 'convert',
      description: 'Convert money in SBT to another currency with Discoin.',
      details: oneLine `
      Do you have a lot of money in SBT and have no use for it?
      Do you wish you had as much money on DiscordTel as on this bot?
      This command converts money in SBT to another bot's currency using Discoin.
      This requires the other bot to support Discoin, duh.
			`,
      examples: ['bal'],
      args: [{
          key: 'amount',
          label: 'amount',
          prompt: 'How much would you like to convert?',
          type: 'float',
          infinite: false
        },
        {
          key: 'toCurrency',
          label: 'currency',
          prompt: 'What currency would you like to convert to? Please specify the currency code. (Find them here: http://discoin-austinhuang.rhcloud.com/rates)',
          type: 'string',
          infinite: false
        }
      ],

      guarded: true
    })
  }

  //eslint-disable-next-line class-methods-use-this
  async run(message, args) {
    sql.get(`SELECT * FROM bank WHERE userId ="${message.author.id}"`).then(row => {
      //eslint-disable-next-line no-negated-condition
      if (!row) {
        message.reply('You don\'t have a bank account! Creating one now...')
        sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [message.author.id, 0, 0])
        message.reply('Account created.')
        /*eslint-disable*/
        return
      } else {
        /*eslint-enable*/
        let userBal = row.balance
        let balAfterTransaction = userBal - args.amount
        if (balAfterTransaction < 0) {
          message.reply(`You can not afford this transaction!
You only have ${userBal} SBT. You would be left with ${balAfterTransaction} SBT after the conversion.
You need ${Math.abs(userBal - args.amount)} more SBT.`)
          //eslint-disable-next-line
          return
          //eslint-disable-next-line no-else-return
        } else {
          //eslint-disable-next-line no-use-before-define
          ifApproved()
        }
      }
    })

    async function ifApproved() {
      request({
        url: `http://discoin-austinhuang.rhcloud.com/transaction/${message.author.id}/${args.amount}/${args.toCurrency.toUpperCase()}`,
        headers: { 'Authorization': config.discoinToken }
      }, function(error, response, body) {
        if (error || response.statusCode === 503) {
          message.reply(`API Error!
Show the following message to a developer:
\`\`\`${body}\`\`\``);
        } else {
          message.reply(`API return: \`\`\`${body}\`\`\``);
          if (body.startsWith('Approved.')) {
            sql.get(`SELECT * FROM bank WHERE userId ="${message.author.id}"`).then(row => {
                //eslint-disable-next-line no-negated-condition
                if (!row) {
                  message.reply('You don\'t have a bank account! Creating one now...')
                  sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [message.author.id, 0, 0])
                  message.reply('Account created.')
                  /*eslint-disable*/
                  return
                } else {
                  /*eslint-enable*/
                  let curBal = parseInt(row.balance)
                  let newBal = curBal - args.amount
                  sql.run(`UPDATE bank SET balance = ${newBal} WHERE userId = ${message.author.id}`)
                }
              })
              .catch((err) => {
                if (err) console.error(`${err} \n${err.stack}`);
                sql.run('CREATE TABLE IF NOT EXISTS bank (userId TEXT, balance INTEGER, points INTEGER)').then(() => {
                  sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [args.user.id, 0, 0])
                  message.reply('Unknown database error. Please run command again.')
                })
                //eslint-disable-next-line
                return
              })
          }
        }
      })
    }
  }
};

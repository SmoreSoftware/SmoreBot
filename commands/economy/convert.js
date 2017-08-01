/*The following is an example of currency coversion
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
const fs = require('fs');
const { RichEmbed } = require('discord.js');


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
      examples: ['convert 100 DTS'],
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
          prompt: 'What currency would you like to convert to? Please specify the currency code. (Find them here: http://discoin.disnodeteam.com/rates)',
          type: 'string',
          infinite: false
        }
      ],

      guarded: true
    })
  }

  //eslint-disable-next-line class-methods-use-this
  async run(message, args) {
    fs.open('./db.lock', 'r', (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log('No DB lock, running convert command')
          //eslint-disable-next-line no-use-before-define
          onSuccess()
        }
        //eslint-disable-next-line no-negated-condition
      } else if (!err) {
        console.error('DB lock exists, convert command halted')
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
            const embed = new RichEmbed()
              .setTitle('Transaction error!')
              .setColor(0xFF0000)
              .setDescription(`You can not afford this transaction!
You only have ${userBal} SBT. You would be left with ${balAfterTransaction} SBT after the conversion.
You need ${Math.abs(userBal - args.amount)} more SBT.`)
            message.replyEmbed(embed)
            //eslint-disable-next-line
            return
            //eslint-disable-next-line no-else-return
          } else if (args.toCurrency.toUpperCase() === 'SBT') {
            const embed = new RichEmbed()
              .setTitle('Transaction error!')
              .setColor(0xFF0000)
              .setDescription(`You can not convert from this currency back to this currency!
Your transaction would end up converting SBT back into SBT.
Please convert to a different currency. They are available [here](http://discoin.disnodeteam.com/rates)`)
            message.replyEmbed(embed)
            /*eslint-disable*/
            return
          } else {
            /*eslint-enable*/
            //eslint-disable-next-line no-use-before-define
            ifApproved()
          }
        }
      })
      sql.close('./bank.sqlite')

      async function ifApproved() {
        request({
          url: `http://discoin.disnodeteam.com/transaction/${message.author.id}/${args.amount}/${args.toCurrency.toUpperCase()}`,
          headers: {
            'Authorization': config.discoinToken,
            'Json': 'true'
          }
        }, function(error, response, body) {
          try {
            JSON.parse(body)
          } catch (err) {
            const embed = new RichEmbed()
              .setTitle('Transaction error!')
              .setColor(0xFF0000)
              .setDescription(`${body}
Please try this transaction again.`)
            message.replyEmbed(embed)
            //eslint-disable-next-line newline-before-return
            return
          }
          const bodyObj = JSON.parse(body)
          if (error || response.statusCode === 503) {
            message.reply(`API Error!
Show the following message to a developer:
\`\`\`${JSON.stringify(body, null, 2)}\`\`\``);
          } else {
            const embed = new RichEmbed()
              .setTitle('Discoin Transaction Created')
              .setAuthor(message.author.tag, message.author.avatarURL)
              .setColor(0x00FF00)
              .addField('Transaction Reciept', `${bodyObj.receipt}`, true)
              .addField('Transaction Amount', `${args.amount} SBT`, true)
              .addField('Converting To', `${bodyObj.currency}`, true)
              .addField('Transaction Status', `${bodyObj.status}`, false)
              .addField('Remaining Daily Limit', `You can still convert ${bodyObj.limitNow} Discoins to ${bodyObj.currency} for today.`, false)
            message.replyEmbed(embed)
            if (bodyObj.status === 'Approved') {
              sql.open('./bank.sqlite')
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
              sql.close('./bank.sqlite')
            }
          }
        })
      }
      //eslint-disable-next-line no-sync
      fs.unlinkSync('./db.lock')
    }
  }
};

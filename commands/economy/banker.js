//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const sql = require('sqlite');
sql.open('./bank.sqlite');

module.exports = class BankerCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'banker',
      aliases: ['managebal', 'managemoney'],
      group: 'economy',
      memberName: 'banker',
      description: 'Manage the bank.',
      details: oneLine `
      This command manages a user's economy entry.
      Useful for if a user had a failed transaction or something glitched.
      Use in moderation and DO NOT use as a means of abusing Discoin.
			`,
      examples: ['bal'],
      args: [{
          key: 'user',
          label: 'user',
          prompt: 'What user would you like to manage? Please mention one only.',
          type: 'member',
          infinite: false
        },
        {
          key: 'type',
          label: 'type',
          prompt: 'What would you like to manage? (Balance / Poimts)',
          type: 'string',
          infinite: false
        },
        {
          key: 'action',
          label: 'action',
          prompt: 'What action would you like to perform? (Give / Take)',
          type: 'string',
          infinite: false
        },
        {
          key: 'amount',
          label: 'amount',
          prompt: 'What amount would you like to perform the action on?',
          type: 'float',
          infinite: false
        }
      ],

      guarded: true
    })
  }

  hasPermission(msg) {
    return this.client.isOwner(msg.author);
  }

  //eslint-disable-next-line class-methods-use-this
  async run(message, args) {
    if (args.type.toLowerCase() === 'balance' || args.type.toLowerCase() === 'bal') {
      if (args.action.toLowerCase() === 'give') {
        sql.get(`SELECT * FROM bank WHERE userId ="${args.user.id}"`).then(row => {
            //eslint-disable-next-line no-negated-condition
            if (!row) {
              message.reply(`The user ${args.user.user.tag} doesn't have a bank account! Creating one now...`)
              sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [args.user.id, 0, 0])
              message.reply('Account created.')
              /*eslint-disable*/
              return
            } else {
              /*eslint-enable*/
              let curBal = parseInt(row.balance)
              let newBal = curBal + args.amount
              sql.run(`UPDATE bank SET balance = ${newBal} WHERE userId = ${args.user.id}`)
              message.reply(`Finished. ${args.amount} SBT awarded to ${args.user.user.tag}`)
            }
          })
          .catch((err) => {
            if (err) console.error(`${err} \n${err.stack}`);
            sql.run('CREATE TABLE IF NOT EXISTS bank (userId TEXT, balance INTEGER, points INTEGER)').then(() => {
              sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [args.user.id, 0, 0])
              message.reply('Table did not exist, user inserted into new table.')
            })
            //eslint-disable-next-line
            return
          })
      } else if (args.action.toLowerCase() === 'take') {
        sql.get(`SELECT * FROM bank WHERE userId ="${args.user.id}"`).then(row => {
            //eslint-disable-next-line no-negated-condition
            if (!row) {
              message.reply(`The user ${args.user.user.tag} doesn't have a bank account! Creating one now...`)
              sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [args.user.id, 0, 0])
              message.reply('Account created.')
              /*eslint-disable*/
              return
            } else {
              /*eslint-enable*/
              let curBal = parseInt(row.balance)
              let newBal = curBal - args.amount
              sql.run(`UPDATE bank SET balance = ${newBal} WHERE userId = ${args.user.id}`)
              message.reply(`Finished. ${args.amount} SBT removed from ${args.user.user.tag}`)
            }
          })
          .catch((err) => {
            if (err) console.error(`${err} \n${err.stack}`);
            sql.run('CREATE TABLE IF NOT EXISTS bank (userId TEXT, balance INTEGER, points INTEGER)').then(() => {
              sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [args.user.id, 0, 0])
              message.reply('Table did not exist, user inserted into new table.')
            })
            //eslint-disable-next-line
            return
          })
      }
    } else if (args.type.toLowerCase() === 'points' || args.type.toLowerCase() === 'pts') {
      if (args.action.toLowerCase() === 'give') {
        sql.get(`SELECT * FROM bank WHERE userId ="${args.user.id}"`).then(row => {
            //eslint-disable-next-line no-negated-condition
            if (!row) {
              message.reply(`The user ${args.user.user.tag} doesn't have a bank account! Creating one now...`)
              sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [args.user.id, 0, 0])
              message.reply('Account created.')
              /*eslint-disable*/
              return
            } else {
              /*eslint-enable*/
              let curPts = parseInt(row.points)
              let newPts = curPts + args.amount
              sql.run(`UPDATE bank SET points = ${newPts} WHERE userId = ${args.user.id}`)
              message.reply(`Finished. ${args.amount} points awarded to ${args.user.user.tag}`)
            }
          })
          .catch((err) => {
            if (err) console.error(`${err} \n${err.stack}`);
            sql.run('CREATE TABLE IF NOT EXISTS bank (userId TEXT, balance INTEGER, points INTEGER)').then(() => {
              sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [args.user.id, 0, 0])
              message.reply('Table did not exist, user inserted into new table.')
            })
            //eslint-disable-next-line
            return
          })
      } else if (args.action.toLowerCase() === 'take') {
        sql.get(`SELECT * FROM bank WHERE userId ="${args.user.id}"`).then(row => {
            //eslint-disable-next-line no-negated-condition
            if (!row) {
              message.reply(`The user ${args.user.user.tag} doesn't have a bank account! Creating one now...`)
              sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [args.user.id, 0, 0])
              message.reply('Account created.')
              /*eslint-disable*/
              return
            } else {
              /*eslint-enable*/
              let curPts = parseInt(row.points)
              let newPts = curPts - args.amount
              sql.run(`UPDATE bank SET points = ${newPts} WHERE userId = ${args.user.id}`)
              message.reply(`Finished. ${args.amount} points removed from ${args.user.user.tag}`)
            }
          })
          .catch((err) => {
            if (err) console.error(`${err} \n${err.stack}`);
            sql.run('CREATE TABLE IF NOT EXISTS bank (userId TEXT, balance INTEGER, points INTEGER)').then(() => {
              sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [args.user.id, 0, 0])
              message.reply('Table did not exist, user inserted into new table.')
            })
            //eslint-disable-next-line
            return
          })
      }
    }
  }
};

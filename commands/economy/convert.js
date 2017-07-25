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
      Do you want to have an opt-in only NSFW channel? A role that you can ping to avoid pinging everyone?
      This command allows for management of a server's public roles.
      Note: Adding and removing public roles must be done by someone with the MANAGE_ROLES permission.
      Giving and taking requires no permissions.
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
};

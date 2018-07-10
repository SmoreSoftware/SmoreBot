/* The following is an example of currency coversion
with Discoin using Discord.js-Commando as a
command framework and SQLite as a database to
store user currencies. This assumes you've
already set up a currency DB, a way to earn
currency, and have a basic knowledge of SQL.*/

const { Command } = require('discord.js-commando');
const { oneLine, stripIndents } = require('common-tags');
const request = require('request');
const sql = require('sqlite');
const fs = require('fs');
const { RichEmbed } = require('discord.js');


module.exports = class ConvertCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'convert',
      aliases: ['convertbal', 'convertmoney', 'changebal', 'changemoney', 'transfer', 'transferbal', 'transfermoney'],
      group: 'economy',
      memberName: 'convert',
      description: 'Convert money in SBT to another currency with Discoin.',
      details: oneLine`
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
        prompt: 'What currency would you like to convert to? Please specify the currency code. (Find them here: http://discoin.sidetrip.xyz/rates)',
        type: 'string',
        infinite: false
      }],

      guarded: true
    });
  }

  run(message, args) {
    message.channel.startTyping();
    fs.open('./db.lock', 'r', err => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log('No DB lock, running convert command');
          onSuccess();
        }
      } else {
        console.error('DB lock exists, convert command halted');
        message.reply('The bank is currently busy. Please run this command again.');
      }
    });
    fs.closeSync(fs.openSync('./db.lock', 'w'));

    function onSuccess() {
      sql.open('./bin/bank.sqlite');
      sql.get(`SELECT * FROM bank WHERE userId ="${message.author.id}"`).then(row => {
        if (!row) {
          message.reply('You don\'t have a bank account! Creating one now...');
          sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
          message.reply('Account created.');
          return;
        }
        const userBal = row.balance;
        const balAfterTransaction = userBal - args.amount;
        if (balAfterTransaction < 0) {
          const embed = new RichEmbed()
            .setTitle('Transaction error!')
            .setColor(0xFF0000)
            .setDescription(stripIndents`You can not afford this transaction!
            You only have ${userBal} SBT. You would be left with ${balAfterTransaction} SBT after the conversion.
            You need ${Math.abs(userBal - args.amount)} more SBT.`);
          message.replyEmbed(embed);
          return;
        } else if (args.toCurrency.toUpperCase() === 'SBT') {
          const embed = new RichEmbed()
            .setTitle('Transaction error!')
            .setColor(0xFF0000)
            .setDescription(stripIndents`You can not convert from this currency back to this currency!
            Your transaction would end up converting SBT back into SBT.
            Please convert to a different currency. They are available [here](http://discoin.disnodeteam.com/rates)`);
          message.replyEmbed(embed);
          return;
        }
        ifApproved();
      });

      const ifApproved = () => {
        request.post({
          url: 'http://discoin.sidetrip.xyz/transaction',
          headers: {
            Authorization: process.env.discoinToken
          },
          json: {
            user: `${message.author.id}`,
            amount: args.amount,
            exchangeTo: args.toCurrency.toUpperCase()
          }
        }, (error, response, body) => {
          if (error || response.statusCode === 403 || response.statusCode === 401 || response.statusCode === 400) {
            const parsedBody = JSON.stringify(body);
            console.log(parsedBody);

            let errorMsg = 'Something went wrong while trying to make this transaction.';
            if (parsedBody.includes('"reason":"verify required"')) {
              errorMsg = 'You are not verified to use Discoin! \nPlease verify [here](http://discoin.sidetrip.xyz/verify)';
            }
            if (parsedBody.includes('"reason":"per-user limit exceeded"')) {
              errorMsg = `You have exceded your daily per-user limit. \nYou may no longer convert to ${args.toCurrency.toUpperCase()} today.`;
            }
            if (parsedBody.includes('"reason":"total limit exceeded"')) {
              errorMsg = 'Discoin has reached its max daily global limit of 100,000 Discoins. \nTransactions are disabled globally. \nThis is not something SmoreSoftware can change. **DO NOT** contact SmoreSoftware about this.';
            }
            if (parsedBody.includes('"reason":"invalid amount"')) {
              errorMsg = 'The amount entered was invalid.';
            }
            if (parsedBody.includes('"reason":"invalid destination currency"')) {
              errorMsg = 'Could not find that currency! \nA list of all currency codes can be found [here](http://discoin.sidetrip.xyz/rates)';
            }
            if (parsedBody.includes('"reason":"amount NaN"')) {
              errorMsg = 'The amount entered was not a number.';
            }

            const embed = new RichEmbed()
              .setTitle('Transaction error!')
              .setColor(0xFF0000)
              .setDescription(stripIndents`${errorMsg}
              Please try this transaction again.`);
            message.replyEmbed(embed);
          } else {
            const embed = new RichEmbed()
              .setTitle('Discoin Transaction Created')
              .setAuthor(message.author.tag, message.author.avatarURL)
              .setColor(0x00FF00)
              .addField('Transaction Reciept:', `${body.receipt}`, true)
              .addField('Transaction Amount:', `${args.amount} SBT`, true)
              .addField('Converting To:', `${args.toCurrency.toUpperCase()}`, true)
              .addField('Transaction Status:', 'Approved', true)
              .addField('Resulting Amount:', `${body.resultAmount} ${args.toCurrency.toUpperCase()}`, true)
              .addField('Remaining Daily Limit:', `You can still convert ${body.limitNow} Discoins to ${args.toCurrency.toUpperCase()} for today.`, false);
            message.replyEmbed(embed);
            if (body.status === 'approved' && response.statusCode === 200) {
              sql.open('./bin/bank.sqlite');
              sql.get(`SELECT * FROM bank WHERE userId ="${message.author.id}"`).then(row => {
                if (row) {
                  const curBal = parseInt(row.balance, 10);
                  const newBal = curBal - args.amount;
                  sql.run(`UPDATE bank SET balance = ${newBal} WHERE userId = ${message.author.id}`);
                } else {
                  message.reply('You don\'t have a bank account! Creating one now...');
                  sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
                  message.reply('Account created. Please run command again.');
                }
              })
                .catch(err => {
                  if (err) console.error(`${err} \n${err.stack}`);
                  sql.run('CREATE TABLE IF NOT EXISTS bank (userId TEXT, balance INTEGER, points INTEGER)').then(() => {
                    sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [args.user.id, 0, 0]);
                    message.reply('Unknown database error. Please run command again.');
                  });
                });
            }
          }
        });
      };
      fs.unlinkSync('./db.lock');
    }
    message.channel.stopTyping();
  }
};

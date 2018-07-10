const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const sql = require('sqlite');
const fs = require('fs');

module.exports = class DailyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'daily',
      group: 'economy',
      memberName: 'daily',
      description: 'Check a user\'s bank balance..',
      details: oneLine`
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
    });
  }

  run(message) {
    fs.open('./db.lock', 'r', err => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log('No DB lock, running daily command');
          onSuccess();
        }
      } else if (!err) {
        console.error('DB lock exists, daily command halted');
        message.reply('The bank is currently busy. Please run this command again.');
      } else {
        return console.error(err);
      }
    });
    fs.closeSync(fs.openSync('./db.lock', 'w'));

    function onSuccess() {
      sql.open('./bin/bank.sqlite');
      sql.get(`SELECT * FROM bank WHERE userId ="${message.author.id}"`).then(async row => {
        if (!row) {
          message.reply('You don\'t have a bank account! Creating one now...');
          sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
          message.reply('Account created.');
          return;
        }
        const curBal = parseInt(row.balance, 10);
        const newBal = curBal + 100;
        const curPoints = parseInt(row.points, 10);
        sql.run(`UPDATE bank SET balance = ${newBal} WHERE userId = ${message.author.id}`);
        sql.run(`UPDATE bank SET points = ${curPoints} WHERE userId = ${message.author.id}`);
        await message.reply(`Daily 100 SBT awarded. Your balance is now ${row.balance + 100} SBT.
Be sure to come back tomorrow!`);
      });
    }
    fs.unlinkSync('./db.lock');
  }
};

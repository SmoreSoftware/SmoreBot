const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const sql = require('sqlite');
const fs = require('fs');

module.exports = class BalCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'bal',
      aliases: ['checkbal', 'userbal', 'money'],
      group: 'economy',
      memberName: 'bal',
      description: 'Check a user\'s bank balance.',
      details: oneLine`
      Do you want to know how close you are to getting a perk?
      Just want to prove you're more active than your friends?
      This command allows you to check your own balance or the balance of someone else.
      Run \`bal\` to check your own balance or \`bal @Bob#1234\` to check someone else's.
			`,
      examples: ['bal'],
      args: [{
        'key': 'user',
        'label': 'user',
        'prompt': ' ',
        'type': 'member',
        'default': ' ',
        'infinite': false
      }],

      guarded: true
    });
  }

  run(message, args) {
    fs.open('./db.lock', 'r', err => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log('No DB lock, running bal command');
          onSuccess();
        }
      } else {
        console.error('DB lock exists, bal command halted');
        message.reply('The bank is currently busy. Please run this command again.');
      }
    });
    fs.closeSync(fs.openSync('./db.lock', 'w'));

    function onSuccess() {
      sql.open('./bin/bank.sqlite');
      if (args.user === ' ') {
        sql.get(`SELECT * FROM bank WHERE userId ="${message.author.id}"`).then(row => {
          if (!row) {
            message.reply('You don\'t have a bank account! Creating one now...');
            sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
            message.reply('Account created.');
            return;
          }
          message.reply(`You currently have ${row.balance} SBT and ${row.points} points.`);
        })
          .catch(err => {
            if (err) console.error(`${err} \n${err.stack}`);
            sql.run('CREATE TABLE IF NOT EXISTS bank (userId TEXT, balance INTEGER, points INTEGER)').then(() => {
              sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
            });
          });
      } else {
        sql.get(`SELECT * FROM bank WHERE userId ="${args.user.id}"`).then(row => {
          if (!row) {
            message.reply(`The user ${args.user.user.tag} doesn't have a bank account!
Have them run this command to create one.`);
            return;
          }
          message.reply(`The user ${args.user.user.tag} currently has ${row.balance} SBT and ${row.points} points.`);
        });
      }
    }
    fs.unlinkSync('./db.lock');
  }
};

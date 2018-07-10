const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const sql = require('sqlite');
const fs = require('fs');

module.exports = class BankerCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'banker',
      aliases: ['managebal', 'managemoney', 'managebank', 'bankcontrol'],
      group: 'economy',
      memberName: 'banker',
      description: 'Manage the bank.',
      details: oneLine`
      This command manages a user's economy entry.
      Useful for if a user had a failed transaction or something glitched.
      Use in moderation and DO NOT use as a means of abusing Discoin.
			`,
      examples: ['banker @Bob#1234 bal give 100'],
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
        prompt: 'What would you like to manage? (Balance / Poimts / All)',
        type: 'string',
        infinite: false
      },
      {
        key: 'action',
        label: 'action',
        prompt: 'What action would you like to perform? (Give / Take / Remove / List)',
        type: 'string',
        infinite: false
      },
      {
        'key': 'amount',
        'label': 'amount',
        'prompt': 'What amount would you like to perform the action on?',
        'type': 'float',
        'default': ' ',
        'infinite': false
      }],
      ownerOnly: true,
      guarded: true
    });
  }

  run(message, args) {
    function onSuccess() {
      sql.open('./bin/bank.sqlite');
      if (args.type.toLowerCase() === 'balance' || args.type.toLowerCase() === 'bal') {
        if (args.action.toLowerCase() === 'give' || args.action.toLowerCase() === 'add') {
          sql.get(`SELECT * FROM bank WHERE userId ="${args.user.id}"`).then(row => {
            if (row) {
              const curBal = parseInt(row.balance, 10);
              const newBal = curBal + args.amount;
              sql.run(`UPDATE bank SET balance = ${newBal} WHERE userId = ${args.user.id}`);
              message.reply(`Finished. ${args.amount} SBT awarded to ${args.user.user.tag}`);
            } else {
              message.reply(`The user ${args.user.user.tag} doesn't have a bank account! Creating one now...`);
              sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [args.user.id, args.amount, 0]);
              message.reply('Account created.');
            }
          })
            .catch(err => {
              if (err) console.error(`${err} \n${err.stack}`);
              sql.run('CREATE TABLE IF NOT EXISTS bank (userId TEXT, balance INTEGER, points INTEGER)').then(() => {
                sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [args.user.id, args.amount, 0]);
                message.reply('Table did not exist, user inserted into new table.');
              });
            });
        } else if (args.action.toLowerCase() === 'take' || args.action.toLowerCase() === 'remove') {
          sql.get(`SELECT * FROM bank WHERE userId ="${args.user.id}"`).then(row => {
            if (!row) {
              message.reply(`The user ${args.user.user.tag} doesn't have a bank account! Creating one now...`);
              sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [args.user.id, args.amount, 0]);
              message.reply('Account created.');
              return;
            }
            const curBal = parseInt(row.balance, 10);
            const newBal = curBal - args.amount;
            sql.run(`UPDATE bank SET balance = ${newBal} WHERE userId = ${args.user.id}`);
            message.reply(`Finished. ${args.amount} SBT removed from ${args.user.user.tag}`);
          })
            .catch(err => {
              if (err) console.error(`${err} \n${err.stack}`);
              sql.run('CREATE TABLE IF NOT EXISTS bank (userId TEXT, balance INTEGER, points INTEGER)').then(() => {
                sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [args.user.id, args.amount, 0]);
                message.reply('Table did not exist, user inserted into new table.');
              });
            });
        } else {
          message.reply('Unrecognized action. Action should be `give` or `take`.');
        }
      } else if (args.type.toLowerCase() === 'points' || args.type.toLowerCase() === 'pts') {
        if (args.action.toLowerCase() === 'give' || args.action.toLowerCase() === 'add') {
          sql.get(`SELECT * FROM bank WHERE userId ="${args.user.id}"`).then(row => {
            if (row) {
              const curPts = parseInt(row.points, 10);
              const newPts = curPts + args.amount;
              sql.run(`UPDATE bank SET points = ${newPts} WHERE userId = ${args.user.id}`);
              message.reply(`Finished. ${args.amount} points awarded to ${args.user.user.tag}`);
            } else {
              message.reply(`The user ${args.user.user.tag} doesn't have a bank account! Creating one now...`);
              sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [args.user.id, args.amount, 0]);
              message.reply('Account created.');
            }
          })
            .catch(err => {
              if (err) console.error(`${err} \n${err.stack}`);
              sql.run('CREATE TABLE IF NOT EXISTS bank (userId TEXT, balance INTEGER, points INTEGER)').then(() => {
                sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [args.user.id, args.amount, 0]);
                message.reply('Table did not exist, user inserted into new table.');
              });
            });
        } else if (args.action.toLowerCase() === 'take' || args.action.toLowerCase() === 'remove') {
          sql.get(`SELECT * FROM bank WHERE userId ="${args.user.id}"`).then(row => {
            if (row) {
              const curPts = parseInt(row.points, 10);
              const newPts = curPts - args.amount;
              sql.run(`UPDATE bank SET points = ${newPts} WHERE userId = ${args.user.id}`);
              message.reply(`Finished. ${args.amount} points removed from ${args.user.user.tag}`);
            } else {
              message.reply(`The user ${args.user.user.tag} doesn't have a bank account! Creating one now...`);
              sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [args.user.id, args.amount, 0]);
              message.reply('Account created.');
            }
          })
            .catch(err => {
              if (err) console.error(`${err} \n${err.stack}`);
              sql.run('CREATE TABLE IF NOT EXISTS bank (userId TEXT, balance INTEGER, points INTEGER)').then(() => {
                sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [args.user.id, args.amount, 0]);
                message.reply('Table did not exist, user inserted into new table.');
              });
            });
        } else {
          message.reply('Unrecognized action. Action should be `give` or `take`.');
        }
      } else if (args.type.toLowerCase() === 'all') {
        if (args.action.toLowerCase() === 'delete' || args.action.toLowerCase() === 'remove') {
          sql.run(`DELETE FROM bank WHERE userId = ${args.user.id}`);
          message.reply('User removed from DB.');
        } else if (args.action.toLowerCase() === 'list') {
          sql.get('SELECT * FROM bank').then(rows => {
            message.reply(`\`\`\`${JSON.stringify(rows, null, 2)}\`\`\``);
          });
        } else {
          message.reply('Unrecognized action. Action should be `remove` or `list`.');
        }
      } else {
        message.reply('Unrecognized type. Type should be `balance`, `points`, or `all`.');
      }
    }

    fs.open('./db.lock', 'r', err => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log('No DB lock, running banker command');
          onSuccess();
        }
      } else {
        console.error('DB lock exists, banker command halted');
        message.reply('The bank is currently busy. Please run this command again.');
      }
    });
    fs.closeSync(fs.openSync('./db.lock', 'w'));

    fs.unlinkSync('./db.lock');
  }
};

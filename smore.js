require('dotenv').load();
const commando = require('discord.js-commando');
const client = new commando.Client({
  owner: [
    '197891949913571329',
    '251383432331001856', // Chronomly
    '156019409658314752',
    '142782417994907648',
    '250432205145243649' // Jdender~
  ],
  commandPrefix: process.env.prefix,
  unknownCommandResponse: false
});
// const defclient = new Discord.Client();
const path = require('path');
const chalk = require('chalk');
const error = chalk.bold.red;
const warn = chalk.keyword('orange');
const debug = chalk.cyan;
const sqlite = require('sqlite');
const sql = require('sqlite');
const { oneLine } = require('common-tags');
const ms = require('ms');
const dbots = require('superagent');
const request = require('request');
const { RichEmbed } = require('discord.js');
const fs = require('fs');
const os = require('os');
// const Discoin = require('discoin');
// const discoin = new Discoin(client.discoinToken);
sql.open('./bin/bank.sqlite');
const cooldownUsers = [];
const waitingUsers = [];
const afkUsers = require('./bin/afk.json');
console.log('Requires and vars initialized.');

const hostname = os.hostname();
const owners = client.options.owner;
const prefix = `The default prefix is "${client.options.commandPrefix}"`;

function dmTemplate() {
  return client.users.get;
}
const DMUser = dmTemplate();

const evalObjects = {
  hostname,
  owners,
  prefix,
  DMUser
};

client.registry
  .registerGroups([
    ['general', 'general'],
    ['misc', 'Miscellaneous'],
    ['support', 'Support'],
    ['control', 'Bot Owners Only'],
    ['fun', 'Fun'],
    ['games', 'Games'],
    ['quote', 'Quote'],
    ['economy', 'Economy'],
    ['moderation', 'Moderation']
  ])

  .registerDefaults()
  .registerEvalObjects(evalObjects)
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.setProvider(sqlite.open('./bin/settings.sqlite').then(db => new commando.SQLiteProvider(db))).catch(console.error);
client.dispatcher.addInhibitor(msg => {
  const blacklist = require('./bin/blacklist.json');
  if (blacklist.guilds.includes(msg.guild.id)) return [`Guild ${msg.guild.id} is blacklisted`, msg.channel.send('This guild has been blacklisted. Appeal here: https://discord.gg/6P6MNAU')];
});
client.dispatcher.addInhibitor(msg => {
  const blacklist = require('./bin/blacklist.json');
  if (blacklist.users.includes(msg.author.id)) return [`User ${msg.author.id} is blacklisted`, msg.reply('You have been blacklisted. Appeal here: https://discord.gg/6P6MNAU')];
});
console.log('Commando set up.');
console.log('Awaiting log in.');

client.notes = require('./bin/notes.json');

function writeNotes() {
  if (os.hostname() !== process.env.hostname) return console.log('Not in production , notes not written to JSON');
  fs.writeFile('./bin/notes.json', JSON.stringify(client.notes, null, 2), err => {
    if (err) console.error(err);
    console.log('Wrote notes to JSON');
  });
}

setInterval(() => {
  writeNotes();
}, ms('60s'));
console.log('Note DB ready.');

setInterval(() => {
  if (os.hostname() !== process.env.hostname) return console.log('Not in production , notes not written to JSON');

  function log() {
    console.log('Wrote afk users to file.');
  }
  fs.writeFile('./bin/afk.json', JSON.stringify(afkUsers, null, 2), { encoding: 'utf8' }, log);
}, ms('30s'));

client
  .on('error', e => console.error(error(e)))
  .on('warn', e => console.warn(warn(e)))
  .on('debug', e => console.log(debug(e)))
  .on('ready', () => {
    console.log(`Client ready; logged in as ${client.user.tag} (${client.user.id}) with prefix "${process.env.prefix}"`);
    dbots.post(`https://discordbots.org/api/bots/${client.user.id}/stats`)
      .set('Authorization', process.env.dbotsToken1)
      // eslint-disable-next-line camelcase
      .send({ server_count: client.guilds.size })
      .end();
    console.log('DBotsList guild count updated.');
    dbots.post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`)
      .set('Authorization', process.env.dbotsToken2)
      // eslint-disable-next-line camelcase
      .send({ server_count: client.guilds.size })
      .end();
    console.log('DBots guild count updated.');
    client.user.setPresence({
      game: {
        name: `${process.env.prefix}help | ${client.guilds.size} servers`,
        type: 0
      }
    });
    console.log('Awaiting actions.');
  })
  .on('disconnect', () => console.warn('Disconnected!'))
  .on('reconnecting', () => console.warn('Reconnecting...'))
  .on('commandError', (cmd, err) => {
    if (err instanceof commando.FriendlyError) return;
    console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
  })
  .on('commandBlocked', (msg, reason) => {
    console.log(oneLine `
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
  })
  .on('commandPrefixChange', (guild, prefix) => {
    console.log(oneLine `
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
  .on('commandStatusChange', (guild, command, enabled) => {
    console.log(oneLine `
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
  .on('groupStatusChange', (guild, group, enabled) => {
    console.log(oneLine `
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
  .on('commandRun', (command, promise, msg) => {
    if (msg.guild) {
      console.log(`Command ran
        Guild: ${msg.guild.name} (${msg.guild.id})
        Channel: ${msg.channel.name} (${msg.channel.id})
        User: ${msg.author.tag} (${msg.author.id})
        Command: ${command.groupID}:${command.memberName}
        Message: "${msg.content}"`);
    } else {
      console.log(`Command ran:
        Guild: DM
        Channel: N/A
        User: ${msg.author.tag} (${msg.author.id})
        Command: ${command.groupID}:${command.memberName}
        Message: "${msg.content}"`);
    }
  })
  .on('guildCreate', guild => {
    console.log(`New guild added:
Guild: ${guild.id}
Name: ${guild.name}
Owner: ${guild.owner.user.tag} (${guild.owner.id})
Created At: ${guild.createdAt}
Members: ${guild.members.size}
Bots: ${guild.members.filter(u => u.user.bot).size} (${Math.floor(guild.members.filter(u => u.user.bot).size / guild.members.size * 100)}%)
Humans: ${guild.members.filter(u => !u.user.bot).size} (${Math.floor(guild.members.filter(u => !u.user.bot).size / guild.members.size * 100)}%)
Now on: ${client.guilds.size} servers`);
    client.channels.get('402318969379225618').send(`New guild added:
Guild: ${guild.id}
Name: ${guild.name}
Owner: ${guild.owner.user.tag} (${guild.owner.id})
Created At: ${guild.createdAt}
Members: ${guild.members.size}
Bots: ${guild.members.filter(u => u.user.bot).size} (${Math.floor(guild.members.filter(u => u.user.bot).size / guild.members.size * 100)}%)
Humans: ${guild.members.filter(u => !u.user.bot).size} (${Math.floor(guild.members.filter(u => !u.user.bot).size / guild.members.size * 100)}%)
Now on: ${client.guilds.size} servers`);
    const botPercentage = Math.floor(guild.members.filter(u => u.user.bot).size / guild.members.size * 100);
    if (botPercentage >= 80) {
      let found = 0;
      guild.channels.map(c => {
        if (found === 0) {
          if (c.type === 'text') {
            if (c.permissionsFor(client.user).has('VIEW_CHANNEL') === true) {
              if (c.permissionsFor(client.user).has('SEND_MESSAGES') === true) {
                c.send('**ALERT:** Your guild has been marked as an illegal guild. \nThis may be due to it being marked as a bot guild or marked as a spam guild. \nThe bot will now leave this server.');
                c.send('If you wish to speak to my developers, you may find them here: https://discord.gg/6P6MNAU');
                found = 1;
              }
            }
          }
        }
      });
      guild.owner.send(`**ALERT:** Your guild, "${guild.name}", has been marked as an illegal guild. \nThis may be due to it being marked as a bot guild or marked as a spam guild. \nThe bot will now leave the server. \nIf you wish to speak to my developer, you may join here: https://discord.gg/t8xHbHY`);
      guild.leave();
      return;
    }
    client.user.setPresence({
      game: {
        name: `${process.env.prefix}help | ${client.guilds.size} servers`,
        type: 0
      }
    });
    guild.settings.set('announcements', 'on');
    const embed = new RichEmbed()
      .setAuthor(client.user.username, client.user.avatarURL)
      .setTitle(`Hello, I'm ${client.user.username}!`)
      .setColor(0x00FF00)
      .setDescription(`Thanks for adding me to your server, "${guild.name}"! To see commands do ${guild.commandPrefix}help. Please note: By adding me to your server and using me, you affirm that you agree to [our TOS](https://smoresoft.uk/tos.html).`);
    guild.owner.send({ embed });
    let found = 0;
    guild.channels.map(c => {
      if (found === 0) {
        if (c.type === 'text') {
          if (c.permissionsFor(client.user).has('VIEW_CHANNEL') === true) {
            if (c.permissionsFor(client.user).has('SEND_MESSAGES') === true) {
              c.send({ embed });
              found = 1;
            }
          }
        }
      }
    });
  })
  .on('guildDelete', guild => {
    console.log(`Existing guild left:
Guild: ${guild.id}
Name: ${guild.name}
Owner: ${guild.owner.user.tag} (${guild.owner.id})
Created At: ${guild.createdAt}
Members: ${guild.members.size}
Bots: ${guild.members.filter(u => u.user.bot).size} (${Math.floor(guild.members.filter(u => u.user.bot).size / guild.members.size * 100)}%)
Humans: ${guild.members.filter(u => !u.user.bot).size} (${Math.floor(guild.members.filter(u => !u.user.bot).size / guild.members.size * 100)}%)
Now on: ${client.guilds.size} servers`);
    client.channels.get('402318969379225618').send(`Existing guild left:
Guild: ${guild.id}
Name: ${guild.name}
Owner: ${guild.owner.user.tag} (${guild.owner.id})
Created At: ${guild.createdAt}
Members: ${guild.members.size}
Bots: ${guild.members.filter(u => u.user.bot).size} (${Math.floor(guild.members.filter(u => u.user.bot).size / guild.members.size * 100)}%)
Humans: ${guild.members.filter(u => !u.user.bot).size} (${Math.floor(guild.members.filter(u => !u.user.bot).size / guild.members.size * 100)}%)
Now on: ${client.guilds.size} servers`);
    client.user.setPresence({
      game: {
        name: `${process.env.prefix}help | ${client.guilds.size} servers`,
        type: 0
      }
    });
  })
  .on('guildMemberAdd', member => {
    function autoRole() {
      const { guild } = member;
      const role = guild.settings.get('autorole');
      if (!role) return;

      if (member.bot) return;
      member.addRole(role, 'SmoreBot Autorole');
    }

    // function greeting() {
    //  let guild = member.guild
    //  let greeting = guild.settings.get('greeting')
    //  let channel = guild.settings.get('greetChan')
    //  channel.send(`${greeting}`)
    // }

    autoRole();
    // greeting()
  })
  .on('message', message => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (message.channel.type !== 'text') return;
    if (message.content.startsWith(message.guild.commandPrefix)) return;

    if (afkUsers[message.author.id]) {
      if (afkUsers[message.author.id].afk === true) {
        message.reply('Welcome back! I have removed your AFK status.');
        afkUsers[message.author.id].afk = false;
      }
    }

    if (message.mentions) {
      message.mentions.users.map(user => {
        if (afkUsers[user.id]) {
          if (afkUsers[user.id].afk === true) {
            message.reply(`${user.username} is AFK: ${JSON.stringify(afkUsers[user.id].status.msg)}`);
          }
        }
      });
    }

    fs.open('./db.lock', 'r', err => {
      if (err) {
        if (err.code === 'ENOENT') {
          onSuccess();
        }
      } else {
        return console.error(err);
      }
    });
    fs.closeSync(fs.openSync('./db.lock', 'w'));

    const onSuccess = () => {
      sql.get(`SELECT * FROM bank WHERE userId ="${message.author.id}"`).then(row => {
          if (row) {
            if (parseInt(row.points, 10) >= 100) {
              const curBal = parseInt(row.balance, 10);
              const newBal = curBal + 1;
              sql.run(`UPDATE bank SET balance = ${newBal} WHERE userId = ${message.author.id}`);
              sql.run(`UPDATE bank SET points = ${0} WHERE userId = ${message.author.id}`);
            }
            if (!cooldownUsers.includes(message.author.id)) {
              sql.get(`SELECT * FROM bank WHERE userId ="${message.author.id}"`).then(row => {
                const newPts = Math.floor(Math.abs((Math.random() * (10 - 36)) + 10));
                sql.run(`UPDATE bank SET points = ${row.points + newPts} WHERE userId = ${message.author.id}`);
                cooldownUsers.push(message.author.id);
              });
            } else if (!waitingUsers.includes(message.author.id)) {
              waitingUsers.push(message.author.id);
              setTimeout(() => {
                const index1 = cooldownUsers.indexOf(message.author.id);
                const index2 = waitingUsers.indexOf(message.author.id);
                cooldownUsers.splice(index1, 1);
                waitingUsers.splice(index2, 1);
              }, ms('1m'));
            }
          } else {
            sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
          }
        })
        .catch(err => {
          if (err) console.error(`${err} \n${err.stack}`);
          sql.run('CREATE TABLE IF NOT EXISTS bank (userId TEXT, balance INTEGER, points INTEGER)').then(() => {
            sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
          });
        });
    };
    fs.unlinkSync('./db.lock');
  })
  .on('messageReactionAdd', (reaction, user) => {
    if (reaction.emoji.name === '⭐') {
      const msg = reaction.message;
      const embed = new RichEmbed()
        .setAuthor(msg.author.username, msg.author.avatarURL)
        .setColor(0xCCA300)
        .addField('Starred By', `${user.username}`, true)
        .addField('Channel', `${msg.channel}`, true)
        .addField('Message', `${msg.content}`, false)
        .setFooter(`⭐ ${client.user.username} Starboard ⭐`)
        .setTimestamp();
      const starboard = client.channels.get(msg.guild.settings.get('starboard'));
      if (!starboard) return;
      if (user.id === msg.author.id) return msg.channel.send(`${msg.author}, You can't star your own messages!`);
      if (msg.reactions.filter(reacts => reacts.emoji.name === '⭐').size > 1) return;
      starboard.send({ embed });
    }
  });

setInterval(() => {
  fs.open('./db.lock', 'r', err => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.log('No DB lock, polling transactions');
        onSuccess();
      }
    } else {
      console.error('DB lock exists, transaction polling halted');
      return console.error(err);
    }
  });
  fs.closeSync(fs.openSync('./db.lock', 'w'));

  function onSuccess() {
    sql.open('./bin/bank.sqlite');
    request({
      url: 'http://discoin.sidetrip.xyz/transactions',
      headers: { Authorization: process.env.discoinToken }
    }, (error, response, body) => {
      console.log(`Body: ${body}`);
      if (error && error !== null) console.log(`Error: ${error}`);

      function getDateTime() {
        const date = new Date();
        let hour = date.getHours();
        hour = (hour < 10 ? '0' : '') + hour;
        let min = date.getMinutes();
        min = (min < 10 ? '0' : '') + min;
        let sec = date.getSeconds();
        sec = (sec < 10 ? '0' : '') + sec;
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        month = (month < 10 ? '0' : '') + month;
        let day = date.getDate();
        day = (day < 10 ? '0' : '') + day;

        return `${year}:${month}:${day}:${hour}:${min}:${sec}`;
      }
      if (!error && response.statusCode === 200) {
        body = JSON.parse(body);
        console.log(JSON.stringify(body, null, 2));
        body.forEach(t => {
          sql.get(`SELECT * FROM bank WHERE userId ="${t.user}"`).then(row => {
              if (row) {
                const curBal = parseInt(row.balance, 10);
                const newBal = curBal + t.amount;
                sql.run(`UPDATE bank SET balance = ${newBal} WHERE userId = ${t.user}`);
                const transAuth = client.users.get(t.user);
                const embed = new RichEmbed()
                  .setTitle('Discoin Transaction recieved\n')
                  .setAuthor(transAuth.tag, transAuth.avatarURL)
                  .setColor(0x0000FF)
                  .addField('Transaction Reciept:', t.receipt, true)
                  .addField('Transaction Status:', 'Approved', true)
                  .addField('Transaction Amount:', `${t.amount} SBT`, true)
                  .addField('Converted From:', t.source, true)
                  .addField('Reception Time:', getDateTime(), true)
                  .setFooter(`Transaction made at ${t.timestamp}`);
                transAuth.send({ embed });
              } else {
                sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [t.user, t.amount, 0]);
                const transAuth = client.users.get(t.user);
                const embed = new RichEmbed()
                  .setTitle('Discoin Transaction recieved\n')
                  .setAuthor(transAuth.tag, transAuth.avatarURL)
                  .setColor(0x0000FF)
                  .addField('Transaction Reciept:', t.receipt, true)
                  .addField('Transaction Status:', 'Approved', true)
                  .addField('Transaction Amount:', `${t.amount} SBT`, true)
                  .addField('Converted From:', t.source, true)
                  .addField('Reception Time:', getDateTime(), true)
                  .setFooter(`Transaction made at ${t.timestamp}`);
                transAuth.send({ embed });
              }
            })
            .catch(err => {
              if (err) return console.error(`${err} \n${err.stack}`);
              sql.run('CREATE TABLE IF NOT EXISTS bank (userId TEXT, balance INTEGER, points INTEGER)').then(() => {
                sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [t.user, t.amount, 0]);
                const transAuth = client.users.get(t.user);
                const embed = new RichEmbed()
                  .setTitle('Discoin Transaction recieved\n')
                  .setAuthor(transAuth.tag, transAuth.avatarURL)
                  .setColor(0x0000FF)
                  .addField('Transaction Reciept:', t.receipt, true)
                  .addField('Transaction Status:', 'Approved', true)
                  .addField('Transaction Amount:', `${t.amount} SBT`, true)
                  .addField('Converted From:', t.source, true)
                  .addField('Reception Time:', getDateTime(), true)
                  .setFooter(`Transaction made at ${t.timestamp}`);
                transAuth.send({ embed });
              });
            });
        });
      }
    });
  }
  fs.unlinkSync('./db.lock');
}, ms('30s'));

client.login(process.env.token).catch(console.error);

process.on('unhandledRejection', err => {
  console.error(`Uncaught Promise Error: \n${err.stack}`);
});

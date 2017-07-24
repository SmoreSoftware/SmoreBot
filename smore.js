/*eslint-disable no-sync*/
//eslint-disable-next-line
const config = require('./stuff.json');
const commando = require('discord.js-commando');
const client = new commando.Client({
  owner: ['197891949913571329', '220568440161697792', '251383432331001856', '186295030388883456'],
  commandPrefix: config.prefix,
  unknownCommandResponse: false
});
//const defclient = new Discord.Client();
const path = require('path');
const sqlite = require('sqlite');
const oneLine = require('common-tags').oneLine;
/*eslint-disable no-unused-vars*/
const ms = require('ms');
//eslint-disable-next-line no-unused-vars
const request = require('superagent');
const fs = require('fs');
let cooldownUsers = [];
let waitingUsers = []
/*eslint-enable no-unused-vars*/
console.log('Requires and vars initialized.');

client.registry
  .registerGroups([
    ['general', 'general'],
    ['misc', 'Miscellaneous'],
    ['support', 'Support'],
    ['control', 'Bot Owners Only'],
    ['fun', 'Fun'],
    ['bank', 'Bank'],
    ['moderation', 'Moderation']
  ])

  .registerDefaults()

  .registerCommandsIn(path.join(__dirname, 'commands'));

client.setProvider(sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new commando.SQLiteProvider(db))).catch(console.error);
console.log('Commando set up.');
console.log('Awaiting log in.');

client
  .on('error', () => console.error)
  .on('warn', () => console.warn)
  .on('debug', () => console.log)
  .on('ready', () => {
    console.log(`Client ready; logged in as ${client.user.tag} (${client.user.id}) with prefix "${config.prefix}"`)
    const dbotsToken1 = config.dbotstoken1
    request.post(`https://discordbots.org/api/bots/${client.user.id}/stats`)
      .set('Authorization', dbotsToken1)
      .send({ 'server_count': client.guilds.size })
      .end();
    console.log('DBotsList guild count updated.')
    const dbotsToken2 = config.dbotstoken2
    request.post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`)
      .set('Authorization', dbotsToken2)
      .send({ 'server_count': client.guilds.size })
      .end();
    console.log('DBots guild count updated.')
    client.user.setGame(`${config.prefix}help | ${client.guilds.size} servers`)
    console.log('Awaiting actions.')
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
        Message: "${msg.content}"`)
    } else {
      console.log(`Command ran:
        Guild: DM
        Channel: N/A
        User: ${msg.author.tag} (${msg.author.id})
        Command: ${command.groupID}:${command.memberName}
        Message: "${msg.content}"`)
    }
  })
  .on('guildCreate', (guild) => {
    console.log(`New guild added:
Guild: ${guild.id}
Name: ${guild.name}
Owner: ${guild.owner.user.tag} (${guild.owner.id})
Members: ${guild.members.size}
Bots: ${guild.members.filter(u => u.user.bot).size} (${Math.floor(guild.members.filter(u => u.user.bot).size / guild.members.size * 100)}%)
Humans: ${guild.members.filter(u => !u.user.bot).size} (${Math.floor(guild.members.filter(u => !u.user.bot).size / guild.members.size * 100)}%)
Now on: ${client.guilds.size} servers`)
    client.channels.get('330701184698679307').send(`New guild added:
Guild: ${guild.id}
Name: ${guild.name}
Owner: ${guild.owner.user.tag} (${guild.owner.id})
Members: ${guild.members.size}
Bots: ${guild.members.filter(u => u.user.bot).size} (${Math.floor(guild.members.filter(u => u.user.bot).size / guild.members.size * 100)}%)
Humans: ${guild.members.filter(u => !u.user.bot).size} (${Math.floor(guild.members.filter(u => !u.user.bot).size / guild.members.size * 100)}%)
Now on: ${client.guilds.size} servers`)
    let botPercentage = Math.floor(guild.members.filter(u => u.user.bot).size / guild.members.size * 100)
    if (botPercentage >= 80) {
      guild.defaultChannel.send('**ALERT:** Your guild has been marked as an illegal guild. \nThis may be due to it being marked as a bot guild or marked as a spam guild. \nThe bot will now leave this server. \nIf you wish to speak to my developer, you may join here: https://discord.gg/t8xHbHY')
      guild.owner.send(`**ALERT:** Your guild, "${guild.name}", has been marked as an illegal guild. \nThis may be due to it being marked as a bot guild or marked as a spam guild. \nThe bot will now leave the server. \nIf you wish to speak to my developer, you may join here: https://discord.gg/t8xHbHY`)
      guild.leave()
    }
    client.user.setGame(`${config.prefix}help | ${client.guilds.size} servers`)
    if (guild) guild.settings.set('announcements', 'on')
  })
  .on('guildDelete', (guild) => {
    console.log(`Exsisting guild left:
Guild: ${guild.id}
Name: ${guild.name}
Owner: ${guild.owner.user.tag} (${guild.owner.id})
Members: ${guild.members.size}
Bots: ${guild.members.filter(u => u.user.bot).size} (${Math.floor(guild.members.filter(u => u.user.bot).size / guild.members.size * 100)}%)
Humans: ${guild.members.filter(u => !u.user.bot).size} (${Math.floor(guild.members.filter(u => !u.user.bot).size / guild.members.size * 100)}%)
Now on: ${client.guilds.size} servers`)
    client.channels.get('330701184698679307').send(`Exsisting guild left:
Guild: ${guild.id}
Name: ${guild.name}
Owner: ${guild.owner.user.tag} (${guild.owner.id})
Members: ${guild.members.size}
Bots: ${guild.members.filter(u => u.user.bot).size} (${Math.floor(guild.members.filter(u => u.user.bot).size / guild.members.size * 100)}%)
Humans: ${guild.members.filter(u => !u.user.bot).size} (${Math.floor(guild.members.filter(u => !u.user.bot).size / guild.members.size * 100)}%)
Now on: ${client.guilds.size} servers`)
    client.user.setGame(`${config.prefix}help | ${client.guilds.size} servers`)
  })
  .on('guildMemberAdd', (member) => {
    function autoRole() {
      let guild = member.guild
      let role = guild.settings.get('autorole')
      if (!role) return
      member.addRole(role)
    }

    //function greeting() {
    //  let guild = member.guild
    //  let greeting = guild.settings.get('greeting')
    //  let channel = guild.settings.get('greetChan')
    //  channel.send(`${greeting}`)
    //}

    autoRole()
    //greeting()
  })

/*this was corrupting the bank json. needs sqlite migration.
.on('message', (message) => {
  if (message.content.startsWith(message.guild.commandPrefix)) return;
  if (message.author.bot) return

  let bank = JSON.parse(fs.readFileSync('./bank.json', 'utf8'));
  if (!bank[message.author.id]) {
    bank[message.author.id] = {
      balance: 0,
      points: 0
    }
    fs.writeFile('./bank.json', JSON.stringify(bank, null, 2), (err) => {
      if (err) {
        console.error(err)
        //eslint-disable-next-line
        return
      }
    })
  }
  //eslint-disable-next-line no-negated-condition
  if (!cooldownUsers.includes(message.author.id)) {
    bank[message.author.id].points++;
    cooldownUsers.push(message.author.id);
    if (bank[message.author.id].points >= 100) {
      let curBal = parseInt(bank[message.author.id].balance)
      let newBal = curBal + 1
      bank[message.author.id] = {
        balance: newBal,
        points: 0
      }
    }
    fs.writeFile('./bank.json', JSON.stringify(bank, null, 2), (err) => {
      if (err) {
        console.error(err)
        //eslint-disable-next-line
        return
      }
    })
  } else {
    //eslint-disable-next-line no-lonely-if
    if (!waitingUsers.includes(message.author.id)) {
      waitingUsers.push(message.author.id)
      setTimeout(function() {
        let index1 = cooldownUsers.indexOf(message.author.id)
        let index2 = waitingUsers.indexOf(message.author.id)
        cooldownUsers.splice(index1, 1)
        waitingUsers.splice(index2, 1)
      }, ms('1m'))
    }
  }
})*/

client.login(config.token).catch(console.error);

process.on('unhandledRejection', err => {
  console.error('Uncaught Promise Error: \n' + err.stack);
});

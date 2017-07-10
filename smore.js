//eslint-disable-next-line
const commando = require('discord.js-commando');
const client = new commando.Client({
  owner: ['197891949913571329', '220568440161697792', '251383432331001856', '186295030388883456'],
  commandPrefix: 's.',
  unknownCommandResponse: false
});
//const defclient = new Discord.Client();
const path = require('path');
const sqlite = require('sqlite');
const oneLine = require('common-tags').oneLine;
const config = require('./stuff.json');
console.log('Requires initialized.');

client.registry
  .registerGroups([
    ['general', 'general'],
    ['misc', 'Miscellaneous'],
    ['support', 'Support'],
    ['control', 'Bot Owners Only'],
    ['fun', 'Fun'],
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
    console.log(`Client ready; logged in as ${client.user.tag} (${client.user.id})`)
    client.user.setGame(`s.help | ${client.guilds.size} servers`)
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
Owner: ${guild.owner.tag} (${guild.owner.id})
Members: ${guild.members.size}
Bots: ${guild.members.filter(u => u.user.bot === true).size}
Now on: ${client.guilds.size} servers`)
    let botPercentage = guild.members.filter(u => u.user.bot.size / guild.members.size) * 100
    if (botPercentage >= 85) {
      guild.defaultChannel.send('**ALERT:** Your guild has been marked as an illegal guild. \nThis may be due to it being marked as a bot guild or marked as a spam guild. \nThe bot will now leave this server. \nIf you wish to speak to my developer, you may join here: https://discord.gg/t8xHbHY')
      guild.owner.send('**ALERT:** Your guild has been marked as an illegal guild. \nThis may be due to it being marked as a bot guild or marked as a spam guild. \nThe bot will now leave this server. \nIf you wish to speak to my developer, you may join here: https://discord.gg/t8xHbHY')
      client.channels.get('330701184698679307').send(`Left bot guild:
Guild: ${guild.id}
Name: ${guild.name}
Owner: ${guild.owner.tag} (${guild.owner.id})
Members: ${guild.members.size}
Bots: ${guild.members.filter(u => u.user.bot === true).size} (${guild.members.filter(u => u.user.bot.size / guild.members.size) * 100}%)
Now on: ${client.guilds.size - 1} servers`)
      guild.leave()
    }
    client.user.setGame(`s.help | ${client.guilds.size} servers`)
    guild.settings.set('announcements', 'on')
  })
  .on('guildDelete', (guild) => {
    console.log(`Exsisting guild left:
Guild: ${guild.id}
Name: ${guild.name}
Owner: ${guild.owner.tag} (${guild.owner.id})
Members: ${guild.members.size}
Now on: ${client.guilds.size} servers`)
    client.user.setGame(`s.help | ${client.guilds.size} servers `)
  })
  .on('guildMemberAdd', (member) => {
    function autoRole() {
      let guild = member.guild
      let role = guild.settings.get('autorole')
      if (!role) return
      member.addRole(role)
    }

    function greeting() {
      let guild = member.guild
      let greeting = guild.settings.get('greeting')
      let channel = guild.settings.get('greetChan')
      channel.send(`${greeting}`)
    }

    autoRole()
    greeting()
  })

client.login(config.token).catch(console.error);

process.on('unhandledRejection', err => {
  console.error('Uncaught Promise Error: \n' + err.stack);
});

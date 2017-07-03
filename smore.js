//eslint-disable-next-line
const commando = require('discord.js-commando');
const client = new commando.Client({
  owner: ['197891949913571329', '220568440161697792'],
  commandPrefix: 'js.',
  unknownCommandResponse: false
});
//const defclient = new Discord.Client();
const path = require('path');
const sqlite = require('sqlite');
const oneLine = require('common-tags').oneLine;
const config = require('./stuff.json');

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

client
  .on('error', () => console.error)
  .on('warn', () => console.warn)
  .on('debug', () => console.log)
  .on('ready', () => {
    console.log(`Client ready; logged in as ${client.user.tag} (${client.user.id})`)
    client.user.setGame('js.help | Beta')
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
    console.log(`New guild added: ${guild.name} (${guild.id}), owned by ${guild.owner.user.tag} (${guild.owner.id}).`)
    guild.fetchMember('290228059599142913')
      .then(() => {
        //eslint-disable-next-line no-useless-escape
        guild.owner.send('Hello! Thank you for having <@290228059599142913> on your server! Please run \`+activate\`.')
        //eslint-disable-next-line newline-per-chained-call
      }).catch(console.error)
  })
  .on('guildMemberAdd', (member) => {
    if (member.id === '290228059599142913') {
      //eslint-disable-next-line no-useless-escape
      member.guild.owner.send('Hello! Thank you for adding <@290228059599142913> to your server! Please run \`+activate\`.')
    }
  });

client.login(config.token).catch(console.error);

process.on('unhandledRejection', err => {
  console.error('Uncaught Promise Error: \n' + err.stack);
});

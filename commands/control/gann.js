//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class GAnnCommand extends commando.Command {
  constructor(bot) {
    super(bot, {
      name: 'gann',
      aliases: ['globalannounce', 'gsay', 'shout', 'gshout', 'tellall'],
      group: 'control',
      memberName: 'gann',
      description: 'Sends a global announcement.',
      details: oneLine `
				This command sends an announcement to all servers.
        Permission locked to bot owners for security reasons.
			`,
      examples: ['gann Hello'],

      args: [{
        key: 'msg',
        label: 'msg',
        prompt: 'What would you like to announce?',
        type: 'string',
        infinite: false
      }],

      guarded: true
    });
  }

  async run(message, args) {
    if (!this.client.isOwner(message.author)) return message.reply('You do not have permission to use this command!')
    if (message.author.id === '197891949913571329') {
      let toSay = `${args.msg}
~TJ, Assistant Developer`
      this.client.guilds.map((guild) => guild.defaultChannel.send(toSay))
      message.reply(`Execution completed. Shouted "${toSay}"`)
    } else if (message.author.id === '220568440161697792') {
      let toSay = `${args.msg}
~Space, Head Developer`
      this.client.guilds.map((guild) => guild.defaultChannel.send(toSay))
      message.reply(`Execution completed. Shouted "${toSay}"`)
    } else {
      this.client.guilds.map((guild) => guild.defaultChannel.send(args.msg))
      message.reply(`Execution completed. Shouted "${args.msg}"`)
    }
  }
};

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

  hasPermission(msg) {
    return this.client.isOwner(msg.author);
  }

  async run(message, args) {
    if (message.author.id === '197891949913571329') {
      let toSay = `${args.msg}
~TJ, SmoreSoftware Maintainer`
      //eslint-disable-next-line array-callback-return
      this.client.guilds.map((guild) => {
        toSay = `${args.msg}
~TJ, SmoreSoftware Maintainer
Want to turn these announcements off? Do \`${guild.commandPrefix}settings add announcements off\` to opt out.`
        let setting = guild.settings.get('announcements')
        //eslint-disable-next-line array-callback-return
        if (setting === 'off') return
        guild.defaultChannel.send(toSay)
      })
      message.reply(`Execution completed. Shouted "${toSay}"`)
    } else if (message.author.id === '220568440161697792') {
      let toSay = `${args.msg}
~Space, Head of SmoreSoftware SmoreBot Team`
      //eslint-disable-next-line array-callback-return
      this.client.guilds.map((guild) => {
        toSay = `${args.msg}
~Space, Head of SmoreSoftware SmoreBot Team
Want to turn these announcements off? Do \`${guild.commandPrefix}settings add announcements off\` to opt out.`
        let setting = guild.settings.get('announcements')
        //eslint-disable-next-line array-callback-return
        if (setting === 'off') return
        guild.defaultChannel.send(toSay)
      })
      message.reply(`Execution completed. Shouted "${toSay}"`)
    } else if (message.author.id === '251383432331001856') {
      let toSay = `${args.msg}
~Chrono, Head of SmoreSoftware`
      //eslint-disable-next-line array-callback-return
      this.client.guilds.map((guild) => {
        toSay = `${args.msg}
~Chrono, Head of SmoreSoftware
Want to turn these announcements off? Do \`${guild.commandPrefix}settings add announcements off\` to opt out.`
        let setting = guild.settings.get('announcements')
        //eslint-disable-next-line array-callback-return
        if (setting === 'off') return
        guild.defaultChannel.send(toSay)
      })
      message.reply(`Execution completed. Shouted "${toSay}"`)
    } else {
      //eslint-disable-next-line array-callback-return
      this.client.guilds.map((guild) => {
        let setting = guild.settings.get('announcements')
        //eslint-disable-next-line array-callback-return
        if (setting === 'off') return
        guild.defaultChannel.send(args.msg)
      })
      message.reply(`Execution completed. Shouted "${args.msg}"`)
    }
  }
};

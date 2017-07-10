//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class PurgeCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'purge',
      aliases: ['apocalypse', 'prune'],
      group: 'main',
      memberName: 'purge',
      description: 'purges the channel',
      details: oneLine `
        DESTROY IT!
			`,
      examples: ['purge 25'],
      args: [{
        key: 'toPurge',
        label: 'purge',
        prompt: 'how many messages?',
        type: 'string',
        infinite: false
      }],
      guildOnly: true,
      guarded: true
    })
  }

  //eslint-disable-next-line class-methods-use-this
  hasPermission(msg) {
    return msg.member.hasPermission('MANAGE_MESSAGES');
  }

  //eslint-disable-next-line class-methods-use-this
  async run(message, args) {
    message.channel.send('PURGING')
    message.channel.bulkDelete(args.toPurge)
      .then(() => {
        message.channel.send('🔥 PURGE COMPLETE 🔥')
      })
  }
};

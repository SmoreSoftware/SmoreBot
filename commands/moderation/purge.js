//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class PurgeCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'purge',
      aliases: ['apocalypse', 'prune'],
      group: 'moderation',
      memberName: 'purge',
      description: 'Deletes a specific number of messages.',
      details: oneLine `
        This command deletes a specific number of messages.
        Can only delete between 2 and 99 messages at a time due to Discord ratelimits.
			`,
      examples: ['purge 25'],
      args: [{
        key: 'toPurge',
        label: 'purge',
        prompt: 'how many messages?',
        type: 'float',
        validate: text => {
          if (text <= 99 && text > 2) return true
          //eslint-disable-next-line newline-before-return
          return 'You can only delete 2-99 messages at a time!'
        },
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

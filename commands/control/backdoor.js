const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class BackdoorCommand extends commando.Command {
  constructor(bot) {
    super(bot, {
      name: 'backdoor',
      aliases: ['getinvite', 'getinv', 'forceinv', 'getmein', 'letmein'],
      group: 'control',
      memberName: 'backdoor',
      description: 'Sends a server invite to the specified server.',
      details: oneLine `

			`,
      examples: ['backdoor 1234567890'],

      args: [{
        key: 'guild',
        label: 'guild',
        prompt: 'What server would you like to backdoor?',
        type: 'string',
        infinite: false
      }],

      guarded: true
    });
  }

  async run(msg, args) {
    if (!this.client.isOwner(msg.author)) return msg.reply('You do not have permission to use this command!')
    if (!msg.guild) {
      const getGuild = this.client.guilds.get(args.guild)
      const toInv = getGuild.defaultChannel
      const invite = toInv.createInvite({
          temporary: false,
          maxAge: 120,
          maxUses: 1
        })
        .then(async invite => {
          msg.author.send(`${invite}`)
        }).catch(console.error)
    } else {
      const getGuild = this.client.guilds.get(args.guild)
      const toInv = getGuild.defaultChannel
      const invite = toInv.createInvite({
          temporary: false,
          maxAge: 120,
          maxUses: 1
        })
        .then(async invite => {
          msg.author.send(`${invite}`)
          msg.reply(':white_check_mark: **Check your DMs.**')
        }).catch(console.error)
    }
  }
};

process.on('unhandledRejection', err => {
  console.error('Uncaught Promise Error: \n' + err.stack);
});

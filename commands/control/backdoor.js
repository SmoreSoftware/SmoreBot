//eslint-disable-next-line
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
      This command sends an invite to the specified server.
      This is used by devs for support or contact to the users.
      Permission is locked to developers. Duh!
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

  hasPermission(msg) {
    return this.client.isOwner(msg.author);
  }

  async run(message, args) {
    //eslint-disable-next-line no-negated-condition
    if (!message.guild) {
      const getGuild = this.client.guilds.get(args.guild)
      const toInv = getGuild.defaultChannel
      //eslint-disable-next-line no-unused-vars
      const invite = toInv.createInvite({
          temporary: false,
          maxAge: 120,
          maxUses: 1
        })
        .then(async invite => {
          message.author.send(`${invite}`)
          //eslint-disable-next-line newline-per-chained-call
        }).catch(console.error)
    } else {
      const getGuild = this.client.guilds.get(args.guild)
      const toInv = getGuild.defaultChannel
      //eslint-disable-next-line no-unused-vars
      const invite = toInv.createInvite({
          temporary: false,
          maxAge: 120,
          maxUses: 1
        })
        .then(async invite => {
          message.author.send(`${invite}`)
          message.reply(':white_check_mark: **Check your DMs.**')
          //eslint-disable-next-line newline-per-chained-call
        }).catch(console.error)
    }
  }
};

process.on('unhandledRejection', err => {
  console.error('Uncaught Promise Error: \n' + err.stack);
});

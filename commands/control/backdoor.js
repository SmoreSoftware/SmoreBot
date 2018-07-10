const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');

module.exports = class BackdoorCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: 'backdoor',
      aliases: ['getinvite', 'getinv', 'forceinv', 'getmein', 'letmein'],
      group: 'control',
      memberName: 'backdoor',
      description: 'Sends a server invite to the specified server.',
      details: oneLine`
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
      ownerOnly: true,
      guarded: true
    });
  }

  run(message, args) {
    const getGuild = this.client.guilds.get(args.guild);
    let found = 0;
    getGuild.channels.map(c => {
      if (found === 0) {
        if (c.type === 'text') {
          if (c.permissionsFor(this.client.user).has('VIEW_CHANNEL') === true) {
            if (c.permissionsFor(this.client.user).has('CREATE_INSTANT_INVITE') === true) {
              found = 1;
              c.createInvite({
                temporary: false,
                maxAge: 120,
                maxUses: 1
              })
                .then(invite => {
                  message.author.send(`${invite}`);
                  if (message.guild) message.reply(':white_check_mark: **Check your DMs.**');
                  return null;
                }).catch(console.error);
            }
          }
        }
      }
    });
  }
};

process.on('unhandledRejection', err => {
  console.error(`Uncaught Promise Error: \n${err.stack}`);
});

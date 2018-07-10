const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const request = require('superagent');
module.exports = class ManpostCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: 'manpost',
      aliases: ['poststats', 'updatestats', 'manpush'],
      group: 'control',
      memberName: 'manpost',
      description: 'Manually makes a POST request with stats to the bot lists.',
      details: oneLine`
      This command manually makes a POST request to the bot lists to update the
      client stats manually. Helpful for sudden growth.
      Permission is locked to developers. Duh!
			`,
      examples: ['debug 1234567890'],
      ownerOnly: true,
      guarded: true
    });
  }

  run(message) {
    request.post(`https://discordbots.org/api/bots/${this.client.user.id}/stats`)
      .set('Authorization', process.env.dbotsToken1)
      .send({ server_count: this.client.guilds.size })
      .end();
    message.reply('DBotsList guild count updated.');
    request.post(`https://bots.discord.pw/api/bots/${this.client.user.id}/stats`)
      .set('Authorization', process.env.dbotsToken2)
      .send({ server_count: this.client.guilds.size })
      .end();
    message.reply('DBots guild count updated.');
    message.reply('Finished.');
  }
};

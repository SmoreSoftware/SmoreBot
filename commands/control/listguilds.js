const { Command } = require('discord.js-commando');
const { oneLine, stripIndents } = require('common-tags');

module.exports = class ListGuildsCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: 'listguilds',
      aliases: ['listservers', 'guilds', 'servers', 'listallguilds', 'listallservers'],
      group: 'control',
      memberName: 'listguilds',
      description: 'Lists information about all the servers the bot is in.',
      details: oneLine`
				This command provides a list of information for each server the bot is in.
        This can be helpful if a certain server is needing help or causing issues.
        Usage is restricted to bot owners.
			`,
      examples: ['listguilds'],
      ownerOnly: true,
      guarded: true
    });
  }

  run(message) {
    this.client.guilds.map(guild => message.channel.send(stripIndents`Guild: ${guild.id}
      Name: ${guild.name}
      Owner: ${guild.owner.user.tag} (${guild.owner.id})
      Default Channel: #${guild.defaultChannel.name} (${guild.defaultChannel.id})
      Members: ${guild.members.size}
      Humans: ${guild.members.filter(u => !u.user.bot).size} (${Math.floor(guild.members.filter(u => !u.user.bot).size / guild.members.size * 100)}%)
      Bots: ${guild.members.filter(u => u.user.bot).size} (${Math.floor(guild.members.filter(u => u.user.bot).size / guild.members.size * 100)}%)`));
  }
};

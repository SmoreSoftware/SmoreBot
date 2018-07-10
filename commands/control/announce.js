const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const { RichEmbed } = require('discord.js');

module.exports = class AnnounceCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: 'announce',
      aliases: ['update', 'lann', 'sendupdate'],
      group: 'control',
      memberName: 'announce',
      description: 'Sends an announcemnt to #announcements in SmoreSoftware',
      details: oneLine`
		    This command sends an announcemnt to #announcements in SmoreSoftware.
            Usage is restricted to bot owners.
			`,
      examples: ['announce'],
      args: [{
        key: 'toAnn',
        label: 'announce',
        prompt: 'What would you like to announce?',
        type: 'string',
        infinite: false
      }],
      guarded: true,
      ownerOnly: true
    });
  }

  async run(message, args) {
    const annChan = this.client.channels.get('282977399761666059');
    const annRole = message.guild.roles.get('338046233765478401');
    annRole.setMentionable(true);
    const embed = new RichEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setDescription(args.toAnn)
      .setColor('0xFF0000')
      .setTimestamp();
    annChan.send('<@&338046233765478401>', { embed }).then(() => {
      message.reply('Announcement sent!');
    });
    annRole.setMentionable(false);
  }
};

//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const { RichEmbed } = require('discord.js')

module.exports = class AnnounceCommand extends commando.Command {
  constructor(bot) {
    super(bot, {
        name: 'announce',
        aliases: ['update'],
        group: 'control',
        memberName: 'announce',
        description: 'Sends an announcemnt to #announcements in SmoreSoftware',
        details: oneLine `
		    This command sends an announcemnt to #announcements in SmoreSoftware.
            Usage is restricted to bot owners.
			`,
        examples: ['announce'],
        args: [{
        key: 'toAnnounce',
        label: 'announce',
        prompt: 'What would you like me to announce?',
        type: 'string',
        infinite: false
        }],
        guarded: true
    });
  }

  hasPermission(msg) {
    return this.client.isOwner(msg.author);
  }
//'<@&338046233765478401>'
  async run(message, args) {
    //eslint-disable-next-line array-callback-return
    const embed = new RichEmbed()
    .setAuthor('New Announcement!', this.client.user.avatarURL)
    .setDescription(args.toAnnounce)
    .setFooter(`From: ${message.author.tag}`)
    .setTimestamp();
    this.client.channels.get('282977399761666059').send('<@&338046233765478401>', {embed: embed}).then((msg) => {
        message.reply('Announcement sent!')
    })
  }
};

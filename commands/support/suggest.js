const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const { RichEmbed } = require('discord.js');

module.exports = class SuggestCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'suggest',
      group: 'support',
      memberName: 'suggest',
      description: 'Suggests something to the developers.',
      details: oneLine`
        Do you like SmoreBot?
        Do you wish that your idea was a part of it?
        Suggest your idea to the developers!
			`,
      examples: ['suggest something cool lol'],
      args: [{
        key: 'toSug',
        label: 'suggestion',
        prompt: 'What would you like to suggest?',
        type: 'string',
        infinite: false
      }],
      guildOnly: true,
      guarded: true
    });
  }

  run(message, args) {
    if (message.guild.member(this.client.user).hasPermission('CREATE_INSTANT_INVITE')) {
      message.channel
        .createInvite({
          temporary: false,
          maxAge: 0,
          maxUses: 1
        })
        .then(invite => {
          const avatarURL = message.author.avatar ? message.author.avatarURL : 'https://discordapp.com/assets/0e291f67c9274a1abdddeb3fd919cbaa.png';
          const embed = new RichEmbed()
            .setTitle(':bangbang: **New suggestion** :bangbang:')
            .setAuthor(`${message.author.tag} (${message.author.id})`, `${avatarURL}`)
            .setColor(0x0000FF)
            .setDescription(`**Guild:** ${message.guild.name} (${message.guild.id}) \n**Channel:** #${message.channel.name} (${message.channel.id}) \n**User:** ${message.author.tag} (${message.author.id}) \n**Suggestion:** ${args.toSug} \n**Invite:** ${invite}`)
            .setFooter('SmoreBot Suggestions System')
            .setTimestamp();
          this.client.channels.get('402318998395682836').send({ embed });
        });
      message.reply('Thank you for your suggestion! The SmoreSoftware development team appreciates all feedback. We will get back to you soon if we like your idea and want to discuss specifics.');
    } else {
      const embed = new RichEmbed()
        .setTitle(':bangbang: **New suggestion** :bangbang:')
        .setAuthor(`${message.author.tag} (${message.author.id})`, `${message.author.avatarURL}`)
        .setColor(0x0000FF)
        .setDescription(`**Guild:** ${message.guild.name} (${message.guild.id}) \n**Channel:** #${message.channel.name} (${message.channel.id}) \n**User:** ${message.author.tag} (${message.author.id}) \n**Suggestion:** ${args.toSug} \n**Invite:** No perms for invites.`)
        .setFooter('SmoreBot Suggestions System')
        .setTimestamp();
      this.client.channels.get('304727510619389964').send({ embed });
      message.reply('Thank you for your suggestion! The SmoreSoftware development team appreciates all feedback. We will get back to you soon if we like your idea and want to discuss specifics.');
    }
  }
};

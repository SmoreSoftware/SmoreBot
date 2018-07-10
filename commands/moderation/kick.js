const { Command } = require('discord.js-commando');
const { oneLine, stripIndents } = require('common-tags');
const { RichEmbed } = require('discord.js');

module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      group: 'moderation',
      memberName: 'kick',
      description: 'Kicks a user.',
      details: oneLine`
        Kicking is a powerful moderation tool with many applications.
        This command kicks a user and logs the moderator's reason for doing so.
        Permission is locked to moderators and above.
			`,
      examples: ['kick @Bob being a bad apple'],
      args: [{
        key: 'user',
        label: 'user',
        prompt: 'Who would you like to kick? Please mention one only.',
        type: 'member',
        infinite: false
      },
      {
        key: 'reason',
        label: 'reason',
        prompt: 'Why is the user being kicked?',
        type: 'string',
        infinite: false
      }],
      guildOnly: true
    });
  }

  un(message, args) {
    const modrole = message.guild.settings.get('modrole');
    const adminrole = message.guild.settings.get('adminrole');
    const modlog = message.guild.settings.get('modlog');
    if (!modrole || !adminrole || !modlog) return message.reply(`This command is not set up to work! Have someone run \`${message.guild.commandPrefix}settings\` to add the \`mod\`, \`admin\`, and \`modlog\` settings.`);
    if (!message.member.roles.has(modrole)) {
      if (!message.member.roles.has(adminrole)) return message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${message.guild.roles.get('modrole')}\`, this is changeable with \`${message.guild.commandPrefix}set add mod @role\``);
    }
    if (!message.guild.member(this.client.user).hasPermission('KICK_MEMBERS')) return message.reply('I do not have permission to kick members!');
    try {
      args.user.kick(`${args.reason} -${message.author.tag}`).then(member => {
        args.user.send(stripIndents`You have been kicked from the server "${message.guild}"!
        Staff member: ${message.author.tag}
        Reason: "${args.reason}"`).catch(console.error);
        const embed = new RichEmbed()
          .setTitle(':bangbang: **Moderation action** :scales:')
          .setAuthor(`${message.author.tag} (${message.author.id})`, `${message.author.avatarURL}`)
          .setColor(0x990073)
          .setDescription(`**Action:** Kick \n**User:** ${args.user.user.tag} (${args.user.id}) \n**Reason:** ${args.reason}`)
          .setTimestamp();
        message.delete(1);
        message.guild.channels.get(modlog).send({
          embed
        });
        message.reply(`The user ${member.user.tag} was successfully kicked.`);
      })
        .catch(err => {
          message.reply(stripIndents`There was an error!
          \`\`\`${err}\`\`\``);
          console.error(err);
        });
    } catch (err) {
      message.reply(stripIndents`There was an error!
      \`\`\`${err}\`\`\``);
      console.error(err);
    }
  }
};

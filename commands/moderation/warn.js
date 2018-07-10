const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const { RichEmbed } = require('discord.js');

module.exports = class WarnCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'warn',
      group: 'moderation',
      memberName: 'warn',
      description: 'Warns a user.',
      details: oneLine`
        Warning a user is useful for minor, first time rule violations.
        This command warns a user, DMs the user warned, and posts in the mod log channel.
        Permission is locked to moderators and above.
			`,
      examples: ['warn @Bob being a bad apple'],
      args: [{
        key: 'user',
        label: 'user',
        prompt: 'Who would you like to warn? Please mention one only.',
        type: 'member',
        infinite: false
      },
      {
        key: 'reason',
        label: 'reason',
        prompt: 'Why is the user being warned?',
        type: 'string',
        infinite: false
      }],
      guildOnly: true
    });
  }

  run(message, args) {
    const modrole = message.guild.settings.get('modrole');
    const adminrole = message.guild.settings.get('adminrole');
    const modlog = message.guild.settings.get('modlog');
    if (!modrole || !adminrole || !modlog) return message.reply(`This command is not set up to work! Have someone run \`${message.guild.commandPrefix}settings\` to add the \`mod\`, \`admin\`, and \`modlog\` settings.`);
    if (!message.member.roles.has(modrole)) {
      if (!message.member.roles.has(adminrole)) return message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${message.guild.roles.get('modrole')}\`, this is changeable with \`${message.guild.commandPrefix}set add mod @role\``);
    }
    args.user.send(`You have been warned on the server "${message.guild}"!
Staff member: ${message.author.tag}
Reason: "${args.reason}"`).catch(console.error);
    const embed = new RichEmbed()
      .setTitle(':bangbang: **Moderation action** :scales:')
      .setAuthor(`${message.author.tag} (${message.author.id})`, `${message.author.avatarURL}`)
      .setColor(0xFFFF00)
      .setDescription(`**Action:** Warning \n**User:** ${args.user.user.tag} (${args.user.id}) \n**Reason:** ${args.reason}`)
      .setTimestamp();
    message.delete(1);
    message.guild.channels.get(modlog).send({
      embed
    });
  }
};

const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const { RichEmbed } = require('discord.js');

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      group: 'moderation',
      aliases: ['banish', 'begone'],
      memberName: 'ban',
      description: 'Bans a user.',
      details: oneLine`
        Banning is a powerful moderation tool with many applications.
        This command bans a user and logs the moderator's reason for doing so.
        Permission is locked to admins and above.
			`,
      examples: ['ban @Bob being a really bad apple'],
      args: [{
        key: 'user',
        label: 'user',
        prompt: 'Who would you like to ban? Please mention one only.',
        type: 'member',
        infinite: false
      },
      {
        key: 'pruneDays',
        label: 'pruneDays',
        prompt: 'How many days worth of messages would you like to delete? (Max is 7)',
        type: 'float',
        infinite: false
      },
      {
        key: 'reason',
        label: 'reason',
        prompt: 'Why is the user being banned?',
        type: 'string',
        infinite: false
      }],
      guildOnly: true
    });
  }

  run(message, args) {
    const adminrole = message.guild.settings.get('adminrole');
    const modlog = message.guild.settings.get('modlog');
    if (!adminrole || !modlog) return message.reply(`This command is not set up to work! Have someone run \`${message.guild.commandPrefix}settings\` to add the \`admin\` and \`modlog\` settings.`);
    if (!message.member.roles.has(adminrole)) return message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${message.guild.roles.get('adminrole')}\`, this is changeable with \`${message.guild.commandPrefix}set add admin @role\``);
    if (!message.guild.member(this.client.user).hasPermission('BAN_MEMBERS')) return message.reply('I do not have permission to ban members!');
    try {
      message.guild.ban(args.user, {
        days: args.pruneDays,
        reason: `${args.reason} -${message.author.tag}`
      }).then(member => {
        args.user
          .send(`You have been banned from the server "${message.guild}"!
Staff member: ${message.author.tag}
Reason: "${args.reason}"`)
          .catch(console.error);
        const embed = new RichEmbed()
          .setTitle(':bangbang: **Moderation action** :scales:')
          .setAuthor(`${message.author.tag} (${message.author.id})`, `${message.author.avatarURL}`)
          .setColor(0xFF0000)
          .setDescription(`**Action:** Ban \n**User:** ${args.user.user.tag} (${args.user.id}) \n**Reason:** ${args.reason}`)
          .setTimestamp();
        message.delete(1);
        message.guild.channels.get(modlog).send({ embed });
        message.reply(`The user ${member.user.tag} was successfully banned.`);
      })
        .catch(err => {
          message.reply(`There was an error!
\`\`\`${err}\`\`\``);
          console.error(err);
        });
    } catch (err) {
      message.reply(`There was an error!
\`\`\`${err}\`\`\``);
      console.error(err);
    }
  }
};

const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const { RichEmbed } = require('discord.js');
const ms = require('ms');

module.exports = class LockdownCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lockdown',
      group: 'moderation',
      memberName: 'lockdown',
      description: 'Mutes an entire channel.',
      details: oneLine`
        Do you need to shut an entire channel up for a bit?
        This command locks down sending messages in a channel.
        Permission is locked to admins and above.
			`,
      examples: ['lockdown 5m you are all bad apples'],
      args: [{
        key: 'time',
        label: 'time',
        prompt: 'How long would you like to mute the user for? (Time is in hours, minutes, or seconds)',
        type: 'string',
        infinite: false
      },
      {
        key: 'reason',
        label: 'reason',
        prompt: 'Why is the channel being locked down?',
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
    if (!message.guild.member(this.client.user).hasPermission('MANAGE_CHANNELS')) return message.reply('I do not have permission to lockdown this channel!');
    const lockit = [];
    const validUnlocks = ['release', 'unlock'];

    if (validUnlocks.includes(args.time)) {
      message.channel.overwritePermissions(message.guild.id, {
        SEND_MESSAGES: null
      }).then(() => {
        message.delete(1);
        message.channel.send(`:loud_sound: Lockdown lifted by ${message.author.tag}.`);
        const embed = new RichEmbed()
          .setTitle(':bangbang: **Moderation action** :scales:')
          .setAuthor(`${message.author.tag} (${message.author.id})`, `${message.author.avatarURL}`)
          .setColor(0x00FF00)
          .setDescription(`**Action:** Lockdown lift \n**Channel:** ${message.channel.name} (${message.channel.id}) \n**Reason:** ${args.reason}`)
          .setTimestamp();
        message.delete(1);
        message.guild.channels.get(modlog).send({
          embed
        });
        clearTimeout(lockit[message.channel.id]);
        delete lockit[message.channel.id];
      }).catch(error => {
        console.log(error);
      });
    } else {
      let count = 0;
      let count2 = 0;
      // console.log(`first ${count2}`)
      message.guild.roles.map(role => message.channel.overwritePermissions(role.id, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false
      })
        .then(() => {
          // console.log(count)
          // console.log(`second ${count2}`)
          if (count === 0) {
            count++;
            // console.log(count)
            message.delete(1);
            message.channel.send(`:mute: Channel locked down for ${ms(ms(args.time), { 'long': true })} by ${message.author.tag}. (Do \`${message.guild.commandPrefix}lockdown unlock <reason>\` to unlock.)`).then(() => {
              const embed = new RichEmbed()
                .setTitle(':bangbang: **Moderation action** :scales:')
                .setAuthor(`${message.author.tag} (${message.author.id})`, `${message.author.avatarURL}`)
                .setColor(0xCC5200)
                .setDescription(`**Action:** Lockdown \n**Channel:** ${message.channel.name} (${message.channel.id}) \n**Reason:** ${args.reason} \n**Time:** ${ms(ms(args.time), { 'long': true })}`)
                .setTimestamp();
              message.guild.channels.get(modlog).send({
                embed
              });
              lockit[message.channel.id] = setTimeout(() => {
                // console.log(`third ${count2}`)
                message.guild.roles.map(role => {
                  message.channel.overwritePermissions(role.id, {
                    SEND_MESSAGES: null,
                    ADD_REACTIONS: null
                  }).then(() => {
                    if (count2 === 0) {
                      count2++;
                      message.channel.send(':loud_sound: Lockdown lifted.');
                      const embed = new RichEmbed()
                        .setTitle(':bangbang: **Moderation action** :scales:')
                        .setAuthor(`${this.client.user.tag} (${this.client.user.id})`, `${this.client.user.avatarURL}`)
                        .setColor(0x00FF00)
                        .setDescription(`**Action:** Lockdown lift \n**Channel:** ${message.channel.name} (${message.channel.id}) \n**Reason:** Time ended, lockdown expired`)
                        .setTimestamp();
                      message.guild.channels.get(modlog).send({
                        embed
                      });
                    }
                  });
                  delete lockit[message.channel.id];
                  return null;
                });
              }, ms(args.time));
            }).catch(error => {
              console.log(error);
            });
          }
        }));
    }
  }
};

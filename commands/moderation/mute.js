const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const { RichEmbed } = require('discord.js');
const ms = require('ms');

module.exports = class MuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'mute',
      aliases: ['silence', 'turnoff', 'off', 'stfu'],
      group: 'moderation',
      memberName: 'mute',
      description: 'Disables a user\'s ability to talk.',
      details: oneLine`
				This command mutes a specified user from text and voice chat.
        This is a great command for if a kick is not needed.
        Permission is locked to moderators and above.
			`,
      examples: ['mute @Bob 5m being a butt'],

      args: [{
        key: 'user',
        label: 'user',
        prompt: 'What user would you like to mute? Please specify one only.',
        type: 'member',
        infinite: false
      },
      {
        key: 'time',
        label: 'time',
        prompt: 'How long would you like to mute the user for? (Time is in hours, minutes, or seconds)',
        type: 'string',
        infinite: false
      },
      {
        key: 'reason',
        label: 'reason',
        prompt: 'Why is the user being muted?',
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
    if (!message.guild.member(this.client.user).hasPermission('MANAGE_CHANNELS')) return message.reply('I do not have permission to mute members!');
    const muted = [];
    const validUnlocks = ['voice', 'unmute'];
    if (validUnlocks.includes(args.time)) {
      message.guild.channels.map(channel => {
        channel.overwritePermissions(args.user, {
          SEND_MESSAGES: null,
          ADD_REACTIONS: null,
          SPEAK: null
        })
          .then(() => console.log('Done per 1 channel.'))
          .catch(err => {
            if (err) console.error(err);
            if (errcount === 0) {
              message.reply('**Failed to mute in one or more channels.** Please mute manually or give me administrator permission and try again.');
              errcount++;
            } else { return console.log(`errcount === ${errcount}`); }
          });
      }).then(() => {
        message.delete(1);
        message.channel.send(`:loud_sound: ${args.user.user.tag} unmuted by ${message.author.tag}.`);
        const embed = new RichEmbed()
          .setTitle(':bangbang: **Moderation action** :scales:')
          .setAuthor(`${message.author.tag} (${message.author.id})`, `${message.author.avatarURL}`)
          .setColor(0x00FF00)
          .setDescription(`**Action:** Unmute \n**User:** ${args.user.user.tag} (${args.user.id}) \n**Reason:** ${args.reason}`)
          .setTimestamp();
        message.delete(1);
        message.guild.channels.get(modlog).send({
          embed
        });
        clearTimeout(muted[args.user.id]);
        delete muted[args.user.id];
      }).catch(error => {
        console.log(error);
      });
    } else {
      let count = 0;
      let count2 = 0;
      // console.log(`first ${count2}`)
      const { client } = this;
      message.guild.channels.map(channel => channel.overwritePermissions(args.user, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false,
        SPEAK: false
      })
        .then(() => {
          if (count === 0) {
            count++;
            message.delete(1);
            message.channel.send(`:mute: ${args.user.user.tag} muted for ${ms(ms(args.time), { 'long': true })} by ${message.author.tag}. (Do \`${message.guild.commandPrefix}mute unmute ${args.user} <reason>\` to unmute.)`).then(() => {
              const embed = new RichEmbed()
                .setTitle(':bangbang: **Moderation action** :scales:')
                .setAuthor(`${message.author.tag} (${message.author.id})`, `${message.author.avatarURL}`)
                .setColor(0xCC5200)
                .setDescription(`**Action:** Mute \n**User:** ${args.user.user.tag} (${args.user.id}) \n**Reason:** ${args.reason} \n**Time:** ${ms(ms(args.time), { 'long': true })}`)
                .setTimestamp();
              message.guild.channels.get(modlog).send({
                embed
              });
              muted[args.user.id] = setTimeout(() => {
                // console.log(`third ${count2}`)
                message.guild.channels.map(channel => {
                  channel.overwritePermissions(args.user, {
                    SEND_MESSAGES: null,
                    ADD_REACTIONS: null,
                    SPEAK: null
                  }).then(() => {
                    if (count2 === 0) {
                      count2++;
                      message.channel.send(`:loud_sound: ${args.user.user.tag} unmuted.`);
                      const embed = new RichEmbed()
                        .setTitle(':bangbang: **Moderation action** :scales:')
                        .setAuthor(`${client.user.tag} (${client.user.id})`, `${client.user.avatarURL}`)
                        .setColor(0x00FF00)
                        .setDescription(`**Action:** Unmute \n**User:** ${args.user.user.tag} (${args.user.id}) \n**Reason:** Time ended, mute expired`)
                        .setTimestamp();
                      message.guild.channels.get(modlog).send({
                        embed
                      });
                    }
                  });
                  delete muted[args.user.id];

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

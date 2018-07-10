const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const afkUsers = require('../../bin/afk.json');

module.exports = class AFKCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'afk',
      aliases: ['away', 'setaway', 'eafk'],
      group: 'general',
      memberName: 'afk',
      description: 'Manages a server\'s public roles.',
      details: oneLine`
      Do you want to have an opt-in only NSFW channel? A role that you can ping to avoid pinging everyone?
      This command allows for management of a server's public roles.
      Note: Adding and removing public roles must be done by someone with the MANAGE_ROLES permission.
      Giving and taking requires no permissions.
			`,
      examples: ['afk getting food'],
      args: [{
        key: 'msg',
        label: 'message',
        prompt: 'What would you like your afk message to be?',
        type: 'string',
        infinite: false
      }],
      guildOnly: true,
      guarded: true
    });
  }

  run(message, args) {
    if (afkUsers[message.author.id]) {
      afkUsers[message.author.id].afk = true;
      afkUsers[message.author.id].status = args;
      afkUsers[message.author.id].id = message.author.id;
      message.channel.send(`${message.author.tag}, I have set your afk to ${JSON.stringify(afkUsers[message.author.id].status.msg)}`);
    } else {
      afkUsers[message.author.id] = {
        afk: false,
        status: 'Online'
      };
      message.reply('This message is normal to see if this is your first time using this command. If so, rerun the command. However, if this is not your first time running this command, then please contact a Developer on the SmoreSoftware server. https://discord.gg/6P6MNAU');
    }
  }
};

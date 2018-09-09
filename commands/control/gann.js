const { Command } = require('discord.js-commando');
const { oneLine, stripIndents } = require('common-tags');

module.exports = class GAnnCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: 'gann',
      aliases: ['globalannounce', 'gsay', 'shout', 'gshout', 'tellall'],
      group: 'control',
      memberName: 'gann',
      description: 'Sends a global announcement.',
      details: oneLine `
				This command sends an announcement to all servers.
        Permission locked to bot owners for security reasons.
			`,
      examples: ['gann Hello'],

      args: [{
        key: 'msg',
        label: 'msg',
        prompt: 'What would you like to announce?',
        type: 'string',
        infinite: false
      }],
      ownerOnly: true,
      guarded: true
    });
  }

  async run(message, args) {
    if (message.author.id === '197891949913571329') {
      let toSay = `${args.msg}
~TJ, SmoreSoftware Chief Operating Officer`;
      this.client.guilds.map(guild => {
        let found = 0;
        toSay = `${args.msg}
~TJ, SmoreSoftware Chief Operating Officer
Want to turn these announcements off? Do \`${guild.commandPrefix}settings add announcements off\` to opt out.`;
        const setting = guild.settings.get('announcements');
        if (setting === 'off') return;
        guild.channels.map(c => {
          if (found === 0) {
            if (c.type === 'text') {
              if (c.permissionsFor(this.client.user).has('VIEW_CHANNEL') === true) {
                if (c.permissionsFor(this.client.user).has('SEND_MESSAGES') === true) {
                  c.send(toSay);
                  found = 1;
                }
              }
            }
          }
          return null;
        });
      });
      message.reply(`Execution completed. Shouted "${toSay}"`);
    } else if (message.author.id === '251383432331001856') {
      let toSay = `${args.msg}
~Chrono, SmoreSoftware Chief Executive Officer`;
      this.client.guilds.map(guild => {
        let found = 0;
        toSay = `${args.msg}
~Chrono, SmoreSoftware Chief Executive Officer
Want to turn these announcements off? Do \`${guild.commandPrefix}settings add announcements off\` to opt out.`;
        const setting = guild.settings.get('announcements');
        if (setting === 'off') return;
        guild.channels.map(c => {
          if (found === 0) {
            if (c.type === 'text') {
              if (c.permissionsFor(this.client.user).has('VIEW_CHANNEL') === true) {
                if (c.permissionsFor(this.client.user).has('SEND_MESSAGES') === true) {
                  c.send(toSay);
                  found = 1;
                }
              }
            }
          }
        });
      });
      message.reply(`Execution completed. Shouted "${toSay}"`);
    } else if (message.author.id === '250432205145243649') {
      let toSay = `${args.msg}
~Jdender, SmoreSoftware Chief Technology Officer`;
      this.client.guilds.map(guild => {
        let found = 0;
        toSay = `${args.msg}
~Jdender, SmoreSoftware Chief Technology Officer
Want to turn these announcements off? Do \`${guild.commandPrefix}settings add announcements off\` to opt out.`;
        const setting = guild.settings.get('announcements');
        if (setting === 'off') return;
        guild.channels.map(c => {
          if (found === 0) {
            if (c.type === 'text') {
              if (c.permissionsFor(this.client.user).has('VIEW_CHANNEL') === true) {
                if (c.permissionsFor(this.client.user).has('SEND_MESSAGES') === true) {
                  c.send(toSay);
                  found = 1;
                }
              }
            }
          }
        });
      });
      message.reply(`Execution completed. Shouted "${toSay}"`);
    } else {
      this.client.guilds.map(guild => {
        let found = 0;
        const toSay = `${args.msg}
~SmoreSoftware
Want to turn these announcements off? Do \`${guild.commandPrefix}settings add announcements off\` to opt out.`;
        const setting = guild.settings.get('announcements');
        if (setting === 'off') return;
        guild.channels.map(c => {
          if (found === 0) {
            if (c.type === 'text') {
              if (c.permissionsFor(this.client.user).has('VIEW_CHANNEL') === true) {
                if (c.permissionsFor(this.client.user).has('SEND_MESSAGES') === true) {
                  c.send(toSay);
                  found = 1;
                }
              }
            }
          }
        });
      });
      message.reply(`Execution completed. Shouted "${args.msg}"`);
    }
  }
};

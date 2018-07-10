const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const { RichEmbed } = require('discord.js');
const os = require('os');

module.exports = class InfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'info',
      group: 'support',
      memberName: 'info',
      description: 'Sends you some info about the bot.',
      details: oneLine`
      Do you like SmoreBot? Do you want to learn more about it?
      This command sends you important information about the bot.
			`,
      examples: ['invite'],
      guildOnly: true,
      guarded: true
    });
  }

  run(message) {
    let host;
    if (os.hostname().toLowerCase() === 'ubuntuserver') {
      host = 'Kaydax';
    } else {
      host = 'local dev instance';
    }
    const embed = new RichEmbed()
      .setAuthor(this.client.user.username, this.client.user.avatarURL)
      .setColor(0x0099cc)
      .setTitle(':information_source:')
      .addField('Main information:', 'I am a Discord Bot made in **JavaScript** using the Discord API Wrapper **Discord.js** on the framework **Discord.js-Commando**', false)
      .addField('Developers:', '• Chronomly • TJDoesCode • Ciel • PizzaFox •', false)
      .addField('Server Count:', `${this.client.guilds.size}`, true)
      .addField('Host', host, true)
      .setTimestamp();
    message.channel.send({ embed });
  }
};

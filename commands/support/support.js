const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const { RichEmbed } = require('discord.js');

module.exports = class SupportCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'support',
      aliases: ['call', 'contact', 'supportcall', 'helpme', 'howtouse', 'bug'],
      group: 'support',
      memberName: 'support',
      description: 'Calls the developer server for support.',
      details: oneLine`
        Do you need help with SmoreBot?
        Use this command to get in contact with the developers and get the help you need!
			`,
      examples: ['support'],
      guildOnly: true,
      guarded: true
    });
  }

  run(msg) {
    let isEnabled;
    const avatarURL = msg.author.avatar ? msg.author.avatarURL : 'https://discordapp.com/assets/0e291f67c9274a1abdddeb3fd919cbaa.png';
    msg.reply('Thank you for contacting SmoreBot Support! If there are any available support representatives, they will contact you soon.');
    const chan = msg.channel;
    const supportChan = '464237929762652161';
    const embed = new RichEmbed()
      .setTitle(':bangbang: **New support call** :bangbang:')
      .setAuthor(`${msg.author.tag} (${msg.author.id})`, `${avatarURL}`)
      .setColor(0xFF0000)
      .setDescription(`**Guild:** ${msg.guild.name} (${msg.guild.id}) \n**Channel:** #${msg.channel.name} (${msg.channel.id}) \n**Started by:** ${msg.author.tag} (${msg.author.id})`)
      .setFooter('SmoreBot Support System')
      .setTimestamp();
    this.client.channels
      .get(supportChan)
      .send('<@&361657331374882816>');
    this.client.channels
      .get(supportChan)
      .send({ embed });
    const collector = this.client.channels
      .get(supportChan)
      .createCollector(message => message.content.startsWith('call'), {
        time: 0
      });
    this.client.channels.get(supportChan).send('Do `call answer` to answer call and connect to server in need or `call end` to deny call.');
    collector.on('message', message => {
      if (message.content === 'call end') collector.stop('aborted');
      if (message.content === 'call answer') collector.stop('success');
    });
    collector.on('end', (collected, reason) => {
      if (reason === 'time') return msg.reply('The call timed out.');
      if (reason === 'aborted') {
        msg.reply(':x: The call has been denied.');
        this.client.channels.get(supportChan).send(':x: Succesfully denied call.');
      }
      if (reason === 'success') {
        this.client.channels.get(supportChan).send(':heavy_check_mark: Call picked up!');
        this.client.channels.get(supportChan).send('Do `call end` at any time to end the call.');
        chan.send(`${msg.author}`);
        chan.send(':heavy_check_mark: Your call has been picked up by a support representative!');
        chan.send(':hourglass: You will be helped shortly.');
        chan.send('Do `call end` at any time to end the call.');
        isEnabled = true;
        this.client.on('message', message => {
          // ! THIS IS LEAKING MEMORY
          function contact() {
            if (isEnabled === false) return;
            if (message.author.id === this.client.user.id) return;
            if (message.content.startsWith('call end')) {
              message.channel.send(':x: Call has been hung up.');
              if (message.channel.id === chan.id) this.client.channels.get(supportChan).send(':x: The call was ended from the other side.');
              if (message.channel.id === supportChan) chan.send(':x: The call was ended from the other side.');

              return isEnabled = false;
            }
            if (message.channel.id === chan.id) this.client.channels.get(supportChan).send(`:telephone_receiver: **${message.author.tag}**: ${message.cleanContent}`);
            if (message.channel.id === supportChan) chan.send(`:star: ${message.cleanContent}`);
          }
          contact(this.client);
        });
      }
    });
  }
};

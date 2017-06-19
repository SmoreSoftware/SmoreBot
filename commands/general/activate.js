const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const Discord = require('discord.js');

module.exports = class ActivateCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'activate',
      group: 'general',
      memberName: 'activate',
      description: 'TOP SECRET',
      details: oneLine `
        This command is top secret, but it has a great feature it unlocks.
        See if you can guess how to unlock it!
			`,
      examples: ['activate'],
      guildOnly: true,
      guarded: true
    })
  }

  async run(message, args) {
    message.guild.fetchMember("290228059599142913")
      .then((member) => {
        if (member) {
          message.reply("Congratulations!")
          message.channel.send(`For having <@290228059599142913> on your server, you have now unlocked extra special features on ${this.client.user}!
As you may or may not know, this bot, ${this.client.user}, and <@290228059599142913> are both developed by the SmoreSoftware organization.
As your reward for having both SmoreSoftware bots, the developers have decided to allow your server to have use of the ${this.client.user} music module!
Enjoy and thank you for supporting SmoreSoftware!`);
          message.guild.settings.set('activated', true)
          console.log(`Activated set to ${message.guild.settings.get('activated')} on ${message.guild.name} (${message.guild.id})`)
        }
      }).catch(console.error);
  }
};

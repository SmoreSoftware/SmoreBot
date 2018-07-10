const { Command } = require('discord.js-commando');
const { oneLine, stripIndents } = require('common-tags');
const { RichEmbed } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

module.exports = class QuoteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'quote',
      group: 'quote',
      memberName: 'quote',
      description: 'Quotes a specified user.',
      details: oneLine`
        Did your friend just say something outragous that should be preserved forever?
        Is he lying about the fact that he said it?
        Well now you can prove to him that he did, in fact, say it!
			`,
      examples: ['quote @Bob#1234'],
      args: [{
        key: 'user',
        label: 'user',
        prompt: 'What user would you like to quote? Please specify one only.',
        type: 'member',
        infinite: false
      }],
      guarded: true
    });
  }

  run(message, args) {
    const quoteUser = args.user.user;
    message.channel
      .fetchMessages({ limit: 100 })
      .then(collected => {
        collected = collected.filterArray(fetchedMsg => fetchedMsg.author.id === args.user.id);
        const msgs = collected.map(m => m.content);
        if (msgs.size < 10) return message.reply('This user does not have enough recent messages!');
        // TODO Use a loop to generate this
        const quotes = stripIndents`
        1: \`${msgs[0].cleanContent}\`
        2: \`${msgs[1].cleanContent}\`
        3: \`${msgs[2].cleanContent}\`
        4: \`${msgs[3].cleanContent}\`
        5: \`${msgs[4].cleanContent}\`
        6: \`${msgs[5].cleanContent}\`
        7: \`${msgs[6].cleanContent}\`
        8: \`${msgs[7].cleanContent}\`
        9: \`${msgs[8].cleanContent}\`
        10: \`${msgs[9].cleanContent}\`
      `;
        const embed = new RichEmbed()
          .setTitle('**Quotes**')
          .setAuthor(quoteUser.username, quoteUser.avatarURL)
          .setColor(0x00CCFF)
          .setDescription(quotes)
          .setFooter('QBot')
          .setTimestamp();
        message.channel.send('The last 10 messages of the user are below.');
        message.channel.send('The message can be picked by doing `option <number>` for the quote you want. Say `cancel` to cancel this command. This prompt times out in 30 seconds.');
        message.channel.send({ embed });
        const collector = message.channel.createCollector(msg => msg.author === message.author, { time: 30000 });
        // ! This is leaking a lot of memory
        collector.on('message', msg => {
          if (msg.content === 'cancel') collector.stop('aborted');
          if (msg.content.startsWith('option')) collector.stop('success');
        });
        collector.on('end', (collected, reason) => {
          if (reason === 'time') return message.channel.send('The command timed out.');
          if (reason === 'aborted') {
            message.reply('Command canceled.');
          }
          if (reason === 'success') {
            let quote = collected.last().content.split(' ').slice(1);
            quote = parseInt(quote, 10);
            quote -= 1;
            const toQuote = msgs[`${quote}`];
            console.log(collected[`${quote}`].createdAt);
            const rawTime = Date.now() - collected[`${quote}`].createdAt;
            console.log(rawTime);
            const sentAgo = moment.duration(rawTime).format(' D [days], H [hours], m [minutes] & s [seconds]');
            const quoteEmbed = new RichEmbed()
              .setTitle('')
              .setAuthor(quoteUser.username, quoteUser.avatarURL)
              .setColor(0x00CCFF)
              .setDescription(`"${toQuote}"`)
              .setFooter(`Message sent ${sentAgo} ago.`);
            message.channel.bulkDelete(5)
              .then(() => {
                message.channel.send({ quoteEmbed });
              });
          }
        });
      });
  }
};

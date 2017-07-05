//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const Twit = require('twit');
const twitconfig = require('./twitconfig.js');
const T = new Twit(twitconfig);

module.exports = class TweetCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'tweet',
      aliases: ['sendtweet', 'twittersend'],
      group: 'control',
      memberName: 'tweet',
      description: 'Sends a tweet through the official SmoreSoftware twitter.',
      details: oneLine `
				This command sends a tweet to the official SmoreSoftware twitter account.
        Permission is locked to developers.
        Duh. Did you really expect to be able to use this?
			`,
      examples: ['tweet hi guys it me'],

      args: [{
        key: 'message',
        label: 'message',
        type: 'string',
        prompt: 'What would you like to tweet? (Max 140 characters)',
        validate: text => {
          if (text.length < 140) return true
          //eslint-disable-next-line newline-before-return
          return 'Your tweet must be 140 characters or less!'
        },
        infinite: false
      }],
      guildOnly: true,
      guarded: true
    });
  }

  //eslint-disable-next-line class-methods-use-this
  async run(message, args) {
    let devs = ['197891949913571329', '220568440161697792', '251383432331001856', '186295030388883456', '250432205145243649', '142782417994907648']
    if (!devs.includes(message.author.id)) return message.channel.send('Sorry, only the SmoreSoftware Development Team can do this!')
    let tweet = {
      status: `${args.message}
-${message.author.username}`
    }

    //eslint-disable-next-line no-use-before-define
    T.post('statuses/update', tweet, tweeted)

    function tweeted(err) {
      if (err) {
        console.error(err)
        message.reply('There was an error! Contact a JS dev. Was your tweet too long?')

        return
      }
      message.reply('Tweet sent successfully.')
    }
  }
};

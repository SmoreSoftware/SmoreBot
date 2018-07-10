const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const Twit = require('twit');
const crypto = require('crypto');
require('dotenv').load();

function decrypt(hash) {
  const decipher = crypto.createDecipher('aes192', process.env.ENC_KEY);
  const encrypted = hash;
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

const TCK = decrypt('5a4aa6988faaf27757d3223294e4e927e9d4ed3d4b0d0faba55108142ccc8048');
const TCS = decrypt('20507520c516f0ed1548abde199f71548af74676c724618be5bac27911631d7d42aa988ad5cb8b4d4977be81379c82e85b1e307e276d9946b07b45f9dcf92735');
const TAT = decrypt('1e64cbc536e7048f1c21cf97ecef6cf0457d7b77e9f3c10f5ce278749acc09e6983631a4ef612dd5a96a7b447fdaf03bdd2f1527c1f5e63c6ac3d9a17b01e246');
const TATS = decrypt('7320425cff5fccd508bc3fb633dce26a2e4d955e22000d64287e947f1bb54bbf0ee599fce5b74af6ed2b41374b03cf26');
/* eslint-disable camelcase */
const T = new Twit({
  consumer_key: TCK,
  consumer_secret: TCS,
  access_token: TAT,
  access_token_secret: TATS
});
/* eslint-enable camelcase */

module.exports = class TweetCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'tweet',
      aliases: ['sendtweet', 'twittersend'],
      group: 'control',
      memberName: 'tweet',
      description: 'Sends a tweet through the official SmoreSoftware twitter.',
      details: oneLine`
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
          if (text.length < 280) return true;
          return 'Your tweet must be 280 characters or less!';
        },
        infinite: false
      }],
      guildOnly: true,
      ownerOnly: true,
      guarded: true
    });
  }

  run(message, args) {
    const tweet = {
      status: `${args.message}
-${message.author.username}`
    };

    const tweeted = err => {
      if (err) {
        console.error(err);
        message.reply('There was an error! Contact a JS dev. Was your tweet too long?');

        return;
      }
      message.reply('Tweet sent successfully.');
    };

    T.post('statuses/update', tweet, tweeted);
  }
};

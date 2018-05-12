//eslint-disable-next-line
/*eslint-disable camelcase*/
/*FUCK THIS. FUCK EVERYTHING. FUCK HEROKU.
THIS WAS FUCKED BY HEROKU. I AXED IT. DONE.
FUCK THIS SHIT.
FUCKING AUTH BULLSHIT.
https://i.imgur.com/oiqrt2N.png

const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const Twit = require('twit');
const dotenv = require('dotenv');
dotenv.load()
const T = new Twit({
	consumer_key: process.env.TWIT_CONSUMER_KEY,
	consumer_secret: process.env.TWIT_CONSUMER_SECRET,
	access_token: process.env.TWIT_ACCESS_TOKEN,
	access_token_secret: process.env.TWIT_ACCESS_TOKEN_SECRET
});
/*eslint-enable camelcase

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
					if (text.length < 280) return true
					//eslint-disable-next-line newline-before-return
					return 'Your tweet must be 280 characters or less!'
				},
				infinite: false
			}],
			guildOnly: true,
			guarded: true
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	//eslint-disable-next-line class-methods-use-this
	async run(message, args) {
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
*/

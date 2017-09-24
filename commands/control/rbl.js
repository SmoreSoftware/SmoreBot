//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const fs = require('fs');

module.exports = class RBLCommand extends commando.Command {
	constructor(bot) {
		super(bot, {
			name: 'rbl',
			aliases: ['removeblacklist', 'delblacklist', 'dbl'],
			group: 'control',
			memberName: 'rbl',
			description: 'Grants a guild or user\'s permission to use the bot back.',
			details: oneLine `
			This command grants a guild or user's permission to use the bot back.
      This is used by devs if a guild or user previously blacklisted had a successful appeal.
      Permission is locked to developers. Duh!
			`,
			examples: ['blacklist 1234567890'],

			args: [{
					key: 'type',
					label: 'type',
					prompt: 'What would you like to remove the blacklist of? (Guild / User)',
					type: 'string',
					infinite: false
				},
				{
					key: 'id',
					label: 'id',
					prompt: 'What is the ID you would like to remove the blacklist of?',
					type: 'string',
					infinite: false
				}
			],

			guarded: true
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(message, args) {
		//eslint-disable-next-line no-sync
		let blacklist = JSON.parse(fs.readFileSync('./blacklist.json', 'utf8'));
		if (args.type.toLowerCase() === 'guild') {
			if (this.client.guilds.find('id', args.id) === null) return message.reply('That guild does not exist, is not in the bot\'s cache, or is not available to the bot.')
			const guildToBlack = this.client.guilds.get(args.id)
			/*eslint-disable quotes*/
			if (!blacklist) blacklist = {
				"guilds": [],
				"users": []
			}
			/*eslint-enable quotes*/
			if (!blacklist.guilds.includes(args.id)) return message.reply(`The guild ${guildToBlack.name} (${guildToBlack.id} isn't blacklisted!`)
			let blackIndex = blacklist.guilds.indexOf(args.id)
      blacklist.guilds.splice(blackIndex, 1)
			fs.writeFile('./blacklist.json', JSON.stringify(blacklist, null, 2), (err) => {
				if (err) {
					message.reply('Something went wrong! Contact a developer.')
					console.error(err)
					//eslint-disable-next-line newline-before-return
					return
				}
				message.reply(`The blacklist on the guild ${guildToBlack.name} (${guildToBlack.id}) has been removed. Permission to all aspects of the bot has been granted.`)
			})
		} else if (args.type.toLowerCase() === 'user') {
			if (this.client.users.find('id', args.id) === null) return message.reply('That user does not exist, is not in the bot\'s cache, or is not available to the bot.')
			const userToBlack = this.client.users.get(args.id)
			/*eslint-disable quotes*/
			if (!blacklist) blacklist = {
				"guilds": [],
				"users": []
			}
			/*eslint-enable quotes*/
			if (!blacklist.users.includes(args.id)) return message.reply(`The user ${userToBlack.tag} (${userToBlack.id}) isn't blacklisted!`)
			let blackIndex = blacklist.users.indexOf(args.id)
      blacklist.users.splice(blackIndex, 1)
			fs.writeFile('./blacklist.json', JSON.stringify(blacklist, null, 2), (err) => {
				if (err) {
					message.reply('Something went wrong! Contact a developer.')
					console.error(err)
					//eslint-disable-next-line newline-before-return
					return
				}
				message.reply(`The blacklist on the user ${userToBlack.tag} (${userToBlack.id}) has been removed. Permission to all aspects of the bot has been granted.`)
			})
		} else {
			return message.reply('Invalid type! Use guild or user.')
		}
	}
};

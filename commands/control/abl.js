//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const fs = require('fs');
//eslint-disable-next-line no-sync

module.exports = class ABLCommand extends commando.Command {
	constructor(bot) {
		super(bot, {
			name: 'abl',
			aliases: ['addblacklist'],
			group: 'control',
			memberName: 'abl',
			description: 'Removes a guild or user\'s permission to use the bot.',
			details: oneLine `
			This command removes a guild or user's permission to use the bot.
      This is used by devs if a guild or user is abusing the bot.
      Permission is locked to developers. Duh!
			`,
			examples: ['blacklist 1234567890'],

			args: [{
					key: 'type',
					label: 'type',
					prompt: 'What would you like to blacklist? (Guild / User)',
					type: 'string',
					infinite: false
				},
				{
					key: 'id',
					label: 'id',
					prompt: 'What is the ID you would like to blacklist?',
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
			if (blacklist.guilds.includes(args.id)) return message.reply(`The guild ${guildToBlack.name} (${guildToBlack.id} is already blacklisted.`)
			blacklist.guilds.push(args.id)
			fs.writeFile('./blacklist.json', JSON.stringify(blacklist, null, 2), (err) => {
				if (err) {
					message.reply('Something went wrong! Contact a developer.')
					console.error(err)
					//eslint-disable-next-line newline-before-return
					return
				}
				message.reply(`The guild ${guildToBlack.name} (${guildToBlack.id}) has been blacklisted from all aspects of the bot.`)
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
			if (blacklist.users.includes(args.id)) return message.reply(`The user ${userToBlack.tag} (${userToBlack.id}) is already blacklisted.`)
			blacklist.users.push(args.id)
			fs.writeFile('./blacklist.json', JSON.stringify(blacklist, null, 2), (err) => {
				if (err) {
					message.reply('Something went wrong! Contact a developer.')
					console.error(err)
					//eslint-disable-next-line newline-before-return
					return
				}
				message.reply(`The user ${userToBlack.tag} (${userToBlack.id}) has been blacklisted from all aspects of the bot.`)
			})
		} else {
			return message.reply('Invalid type! Use guild or user.')
		}
	}
};

//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const allowed = require('./techsupport.json');

module.exports = class ConnectCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'connect',
			aliases: ['connecttochan', 'callchan'],
			group: 'support',
			memberName: 'connect',
			description: 'Opens a support connection to a channel.',
			details: oneLine `
				Did you miss a supprt call?
				Use this command to open a support connection to any channel and assist them.
			`,
			examples: ['connect 322450311597916172'],

			args: [{
				key: 'chan',
				label: 'channel',
				prompt: 'What channel would you like to connect to? Please specify one ID only.',
				type: 'string',
				infinite: false
			}],

			guildOnly: true,
			guarded: true
		})
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author) || allowed.general.includes(msg.author.id);
	}

	async run(message, args) {
		const chan = this.client.channels.get(args.chan)
		let supportChan = '322450311597916172'
		supportChan = this.client.channels.get(supportChan)
		let isEnabled = true

		chan.send('**ALERT:** Incoming call from SmoreSoftware Support!')
		supportChan.send(`Connecting to "#${chan.name}" {${chan.id}) on the guild "${chan.guild.name}" (${chan.guild.id})`)
		let sent = 0
		this.client.on('message', message => {
			if (sent === 0) {
				//eslint-disable-next-line no-useless-escape
				supportChan.send('Connected. Do \`call end\` at any time to end the call.')
				sent = 1
			}

			function contact() {
				if (isEnabled === false) return
				if (message.author.id === '290228059599142913') return
				if (message.content.startsWith('call end')) {
					message.channel.send(':x: Call has been hung up.')
					if (message.channel.id === chan.id) supportChan.send(':x: The call was ended from the other side.')
					if (message.channel.id === supportChan) chan.send(':x: The call was ended from the other side.')

					return isEnabled = false
				}
				if (message.channel.id === chan.id) supportChan.send(`:telephone_receiver: **${message.author.tag}**: ${message.content}`)
				if (message.channel.id === supportChan.id) chan.send(`:star: ${message.content}`)
			}
			contact()
		})
	}
};

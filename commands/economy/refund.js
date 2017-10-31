//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const request = require('request');
const config = require('./stuff.json');
const sql = require('sqlite');
const fs = require('fs');
const { RichEmbed } = require('discord.js');

module.exports = class RefundCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'refund',
			group: 'economy',
			memberName: 'refund',
			description: 'Check a user\'s bank balance.',
			details: oneLine `
      Do you want to know how close you are to getting a perk?
      Just want to prove you're more active than your friends?
      This command allows you to check your own balance or the balance of someone else.
      Run \`bal\` to check your own balance or \`bal @Bob#1234\` to check someone else's.
			`,
			examples: ['bal'],
			args: [{
				key: 'trans',
				label: 'transaction',
				prompt: 'What is the receipt of the transaction you would like to refund?',
				type: 'string',
				infinite: false
			}],

			guarded: true
		})
	}

	//eslint-disable-next-line class-methods-use-this
	async run(message, args) {
		fs.open('./db.lock', 'r', (err) => {
			if (err) {
				if (err.code === 'ENOENT') {
					console.log('No DB lock, running bal command')
					//eslint-disable-next-line no-use-before-define
					onSuccess()
				}
				//eslint-disable-next-line no-negated-condition
			} else if (!err) {
				console.error('DB lock exists, bal command halted')
				message.reply('The bank is currently busy. Please run this command again.')
				//eslint-disable-next-line newline-before-return, no-useless-return
				return
			} else {
				return console.error(err)
			}
		})
		//eslint-disable-next-line no-sync
		fs.closeSync(fs.openSync('./db.lock', 'w'))

		async function onSuccess() {
			request.post({
				url: 'http://discoin.sidetrip.xyz/transaction/reverse',
				headers: {
					'Authorization': config.discoinToken
				},
				json: {
					'receipt': `${args.trans}}`
				}
			}, function (error, response, body) {
				if (error || response.statusCode === 403 || response.statusCode === 401 || response.statusCode === 400) {
					const parsedBody = JSON.stringify(body)
					console.log(parsedBody)

					let errorMsg = 'Something went wrong while trying to make this transaction.'
					if (parsedBody.includes('"reason":"verify required"')) {
						errorMsg = 'You are not verified to use Discoin! \nPlease verify [here](http://discoin.sidetrip.xyz/verify)'
					}
					if (parsedBody.includes('"reason":"cannot refund a refund"') || parsedBody.includes('"reason:"transaction already reversed"')) {
						errorMsg = 'You may not reverse a transaction that has already been reversed!'
					}
					if (parsedBody.includes('"reason":"transaction must be to your bot"')) {
						errorMsg = 'The transaction specified was not to SmoreBot.'
					}
					if (parsedBody.includes('"reason":"transaction not found"')) {
						errorMsg = 'Could not find the transaction specified. \nDid you add any spaces before or after the receipt?'
					}

					const embed = new RichEmbed()
						.setTitle('Transaction error!')
						.setColor(0xFF0000)
						.setDescription(`${errorMsg}
Please try this transaction again.`)
					message.replyEmbed(embed)

				} else {
					/*request.get({
						url: `http://discoin.sidetrip.xyz/transaction/${args.trans}`
					}, function (error1, response1, body1) {
						sql.open('./bank.sqlite')
						sql.get(`SELECT * FROM bank WHERE userId ="${message.author.id}"`).then(row => {
							//eslint-disable-next-line no-negated-condition
							if (!row) {
								message.reply('You don\'t have a bank account! Creating one now...')
								sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [message.author.id, 0, 0])
								message.reply('Account created. Please run command again.')
								eslint-disable
								return
							} else {
								eslint-enable
								let curBal = parseInt(row.balance)
								let newBal = curBal - body1.amountTaraget
								sql.run(`UPDATE bank SET balance = ${newBal} WHERE userId = ${message.author.id}`)
							}
						})
						.catch((err) => {
							if (err) console.error(`${err} \n${err.stack}`);
							sql.run('CREATE TABLE IF NOT EXISTS bank (userId TEXT, balance INTEGER, points INTEGER)').then(() => {
								sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [message.author.id, 0, 0])
								message.reply('Unknown database error. Please run command again.')
							})
							//eslint-disable-next-line
							return
						})
					})*/
				}
			})
			//eslint-disable-next-line no-sync
			fs.unlinkSync('./db.lock')
		}
	}
};
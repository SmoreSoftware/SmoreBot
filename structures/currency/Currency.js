/*eslint-disable*/
const sql = require('sqlite');

class Currency {
	static changeBalance(user, amount) {
		let msg
		sql.open('../../bin/bank.sqlite')
		sql.get(`SELECT * FROM bank WHERE userId ="${user}"`).then(row => {
				if (!row) {
					sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [user, amount, 0])
					msg = 'Created account and set balance.'
					/*eslint-disable*/
					return msg;
				} else {
					/*eslint-enable*/
					sql.run(`UPDATE bank SET balance = ${amount} WHERE userId = ${user}`)
					msg = 'Changed balance.'
					return msg;
				}
			})
			.catch((err) => {
				if (err) console.error(`${err} \n${err.stack}`);
				sql.run('CREATE TABLE IF NOT EXISTS bank (userId TEXT, balance INTEGER, points INTEGER)').then(() => {
					sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [user, 0, 0])
				})
				//eslint-disable-next-line
				msg = 'Created table and set balance.'
				return msg;
			})
	}

	static addBalance(user, amount) {
		let msg
		sql.open('../../bin/bank.sqlite')
		sql.get(`SELECT * FROM bank WHERE userId ="${user}"`).then(row => {
				//eslint-disable-next-line no-negated-condition
				if (!row) {
					sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [user, amount, 0])
					msg = 'Created account and set balance.'
					/*eslint-disable*/
					return msg;
				} else {
					/*eslint-enable*/
					let curBal = parseInt(row.balance)
					let newBal = curBal + amount
					sql.run(`UPDATE bank SET balance = ${newBal} WHERE userId = ${user}`)
					msg = 'Added balance.'
					return msg;
				}
			})
			.catch((err) => {
				if (err) console.error(`${err} \n${err.stack}`);
				sql.run('CREATE TABLE IF NOT EXISTS bank (userId TEXT, balance INTEGER, points INTEGER)').then(() => {
					sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [user, 0, 0])
				})
				//eslint-disable-next-line
				msg = 'Created table and set balance.'
				return msg;
			})
	}

	static removeBalance(user, amount) {
		let msg
		sql.open('../../bin/bank.sqlite')
		sql.get(`SELECT * FROM bank WHERE userId ="${user}"`).then(row => {
				//eslint-disable-next-line no-negated-condition
				if (!row) {
					sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [user, amount, 0])
					msg = 'Created account and set balance.'
					/*eslint-disable*/
					return msg;
				} else {
					/*eslint-enable*/
					let curBal = parseInt(row.balance)
					let newBal = curBal - amount
					sql.run(`UPDATE bank SET balance = ${newBal} WHERE userId = ${user}`)
					msg = 'Removed balance.'
					return msg;
				}
			})
			.catch((err) => {
				if (err) console.error(`${err} \n${err.stack}`);
				sql.run('CREATE TABLE IF NOT EXISTS bank (userId TEXT, balance INTEGER, points INTEGER)').then(() => {
					sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [user, 0, 0])
				})
				//eslint-disable-next-line
				msg = 'Created table and set balance.'
				return msg;
			})
	}

	static async getBalance(user) {
		sql.open('../../bin/bank.sqlite')
		sql.get(`SELECT * FROM bank WHERE userId ="${user}"`).then(row => {
				//eslint-disable-next-line no-negated-condition
				if (!row) {
					sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [user, 0, 0])
					/*eslint-disable*/
					return 0;
				} else {
					/*eslint-enable*/
					return parseInt(row.balance);
				}
			})
			.catch((err) => {
				if (err) console.error(`${err} \n${err.stack}`);
				sql.run('CREATE TABLE IF NOT EXISTS bank (userId TEXT, balance INTEGER, points INTEGER)').then(() => {
					sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [user, 0, 0])
				})
				//eslint-disable-next-line
				return 0;
			})
	}

	static convert(amount, text = false) {
		if (isNaN(amount)) amount = parseInt(amount);
		if (!text) return `${amount.toLocaleString()} ${Math.abs(amount) === 1 ? Currency.singular : Currency.plural}`;

		return `${amount.toLocaleString()} ${Math.abs(amount) === 1 ? Currency.textSingular : Currency.textPlural}`;
	}

	static get singular() {
		return 'token';
	}

	static get plural() {
		return 'tokens';
	}

	static get textSingular() {
		return 'token';
	}

	static get textPlural() {
		return 'tokens';
	}
}

module.exports = Currency;

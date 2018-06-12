const sql = require('sqlite');

class Currency {
	constructor() {
		sql.open('./bin/bank.sqlite').then(() => {
			sql.run('CREATE TABLE IF NOT EXISTS bank (userId TEXT, balance INTEGER, points INTEGER)');
		});
	}

	static async _queryBalance(user) {
		//eslint-disable-next-line arrow-body-style
		const row = await sql.get(`SELECT * FROM bank WHERE userId ="${user}"`)
		//eslint-disable-next-line no-negated-condition
		if (!row) {
			await sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [user, 0, 0]);
			return {
				user: user,
				balance: 0,
				points: 0
			}
		}
		return row;
	}

	static _writeBalance(user, amount) {
		Currency._queryBalance(user).then((row) => {
			if (Math.sign(parseInt(amount)) === 1) {
				const curBal = parseInt(row.balance);
				const newBal = curBal + amount;
				sql.run(`UPDATE bank SET balance = ${newBal} WHERE userId = ${user}`);
			} else if (Math.sign(parseInt(amount)) === -1) {
				const curBal = parseInt(row.balance);
				const newBal = curBal - amount;
				sql.run(`UPDATE bank SET balance = ${newBal} WHERE userId = ${user}`);
			}
		});
	}

	static addBalance(user, amount) {
		Currency._writeBalance(user, amount);
	}

	static removeBalance(user, amount) {
		Currency._writeBalance(user, -amount);
	}

	static async getBalance(user) {
		const row = Currency._queryBalance(user);
		return row.balance;
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
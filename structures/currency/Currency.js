const sql = require('sqlite');

class Currency {
  constructor() {
    sql.open('./bin/bank.sqlite').then(() => {
      sql.run('CREATE TABLE IF NOT EXISTS bank (userId TEXT, balance INTEGER, points INTEGER)');
    });
  }

  static async _queryBalance(user) {
    const row = await sql.get(`SELECT * FROM bank WHERE userId ="${user}"`);
    if (!row) {
      await sql.run('INSERT INTO bank (userId, balance, points) VALUES (?, ?, ?)', [user, 0, 0]);
      return {
        user,
        balance: 0,
        points: 0
      };
    }
    return row;
  }

  static _writeBalance(user, amount) {
    Currency._queryBalance(user).then(row => {
      const sign = Math.sign(parseInt(amount, 10));
      if (sign === 1) {
        const curBal = parseInt(row.balance, 10);
        const newBal = curBal + amount;
        sql.run(`UPDATE bank SET balance = ${newBal} WHERE userId = ${user}`);
      } else if (sign === -1) {
        const curBal = parseInt(row.balance, 10);
        const newBal = curBal - Math.abs(amount);
        sql.run(`UPDATE bank SET balance = ${newBal} WHERE userId = ${user}`);
      }
    });
  }

  static setBalance(user, amount) {
    Currency._queryBalance(user).then(() => {
      sql.run(`UPDATE bank SET balance = ${amount} WHERE userId = ${user}`);
    });
  }

  static changeBalance(user, amount) {
    Currency._writeBalance(user, amount);
  }

  static addBalance(user, amount) {
    Currency._writeBalance(user, amount);
  }

  static removeBalance(user, amount) {
    Currency._writeBalance(user, -amount);
  }

  static getBalance(user) {
    const row = Currency._queryBalance(user);
    return row.balance;
  }

  static convert(amount, text = false) {
    if (isNaN(amount)) amount = parseInt(amount, 10);
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

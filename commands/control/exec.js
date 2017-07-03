//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const childProcess = require('child_process');

module.exports = class ExecCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'exec',
      aliases: ['run', 'bash', 'execute'],
      group: 'control',
      memberName: 'exec',
      description: 'Executes bash commands.',
      details: oneLine `
				This command executes raw bash command.
        Permission is locked to JS Team members.
        Duh. Did you really expect to be able to use this?
			`,
      examples: ['exec git pull'],

      guarded: true
    });
  }

  async run(message) {
    if (!this.client.isOwner(message.author)) return message.channel.send('Sorry, only the JS Devs `SpaceX#0276` or `TJDoesCode#6088` can do this!')
    let toExec = message.content.split(' ').slice(1);
    childProcess.exec(toExec.join(' '), {},
      //eslint-disable-next-line no-unused-vars
      (err, stdout, stderr) => {
        if (err) return message.channel.sendCode('', err.message)
        message.channel.sendCode('', stdout)
      }) //.catch(console.error)
  }
};

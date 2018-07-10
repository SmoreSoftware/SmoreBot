const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const childProcess = require('child_process');

module.exports = class ExecCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'exec',
      aliases: ['run', 'bash', 'execute'],
      group: 'control',
      memberName: 'exec',
      description: 'Executes bash commands.',
      details: oneLine`
				This command executes raw bash command.
        Permission is locked to JS Team members.
        Duh. Did you really expect to be able to use this?
			`,
      examples: ['exec git pull'],
      ownerOnly: true,
      guarded: true
    });
  }

  run(message) {
    const toExec = message.content.split(' ').slice(1);
    childProcess.exec(toExec.join(' '), {},
      (err, stdout) => {
        if (err) return message.channel.sendCode('', err.message);
        message.channel.sendCode('', stdout);
      }); // .catch(console.error)
  }
};

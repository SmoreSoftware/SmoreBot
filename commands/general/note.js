const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const { RichEmbed } = require('discord.js');
const { writeFileSync, readFileSync } = require('fs');

module.exports = class NoteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'note',
      aliases: ['notes'],
      group: 'general',
      memberName: 'note',
      description: 'Manage your personal notepad.',
      details: oneLine`
			Have you ever wanted to save something quickly in Discord?
			This command gives you your own personal notepad that can be accessed incredibly easily!
			`,
      examples: ['note create hi Hello, world!']

      // args: [
      // 	{
      // 		key: 'NoteToGet',
      // 		label: 'RequesetedNote',
      // 		prompt: 'What note would you like to get?',
      // 		type: 'integer'
      // 	}
      // ]
    });
  }

  async run(message) {
    if (!this.client.notes[message.author.id]) {
      this.client.notes[message.author.id] = {
        notes: [{
          title: 'Hello World!',
          content: 'Thanks for using SmoreBot!'
        }]
      };
      writeFileSync('./notes.json', JSON.stringify(this.client.notes, null, 2));
      const CurrentNotes = JSON.parse(readFileSync('./notes.json'));
      if (CurrentNotes[message.author.id]) {
        message.reply('Added you to the database. Please run this command again.');
      }
    } else {
      const [action, title] = message.content.split(/\s+/g).slice(1);
      const content = message.content.split(/\s+/g).slice(3).join(' ');
      const user = this.client.notes[message.author.id];

      if (action === 'get') {
        const NoteToGet = parseInt(title, 10);
        const note = user.notes[NoteToGet];
        const embed = new RichEmbed()
          .setTitle(note.title)
          .setAuthor(this.client.user.username, message.author.avatarURL)
          .setColor(0x00CCFF)
          .setDescription(note.content)
          .setTimestamp();
        message.channel.send({ embed });
      } else
      if (action === 'create') {
        const newNote = {
          title: `${title}`,
          content: `${content}`
        };
        console.log(newNote);
        user.notes.push(newNote);
        writeFileSync('./notes.json', JSON.stringify(this.client.notes, null, 2));
        const embed = new RichEmbed()
          .setTitle(newNote.title)
          .setAuthor(this.client.user.username, message.author.avatarURL)
          .setColor(0x00CCFF)
          .setDescription(newNote.content)
          .setTimestamp();
        message.channel.send(`<@${message.author.id}>, Note Saved`, {
          embed
        });
      } else
      if (action === 'list') {
        const embed = new RichEmbed()
          .setTitle('All Notes')
          .setColor(0x00CCFF)
          .setTimestamp()
          .setDescription(`Command usage is \`${message.guild.commandPrefix}note (action) (arguments)\`. Possible actions are \`create\`, \`get\`, \`list\`, and \`delete\`. 
To create a note: \`${message.guild.commandPrefix}note create (note title) (note content)\`
To get a note: \`${message.guild.commandPrefix}note get (ID)\`
To list all notes: \`${message.guild.commandPrefix}note list\`
To delete a note: \`${message.guild.commandPrefix}note delete (ID)\`
----------------------------------------------------------------------------------------------`);
        user.notes.map(note => {
          const noteID = user.notes.indexOf(note);
          embed.addField(`${note.title} (ID: ${noteID})`, `${note.content}\n----------------------------------------------------------------------------------------------`);
        });
        await message.channel.send({ embed });
      } else
      if (action === 'delete') {
        const NoteToDelete = parseInt(title, 10);
        console.log(NoteToDelete);
        const index = user.notes.indexOf(NoteToDelete);
        user.notes.splice(index, 1);
        writeFileSync('./notes.json', JSON.stringify(this.client.notes, null, 2));
        message.reply('Note Deleted.');
      } else {
        message.reply(`Incorrect usage! Correct usage is \`${message.guild.commandPrefix}note (action) (arguments)\`. Possible actions are \`create\`, \`get\`, \`list\`, and \`delete\`. 
To create a note: \`${message.guild.commandPrefix}note create (note title) (note content)\`
To get a note: \`${message.guild.commandPrefix}note get (ID)\`
To list all notes: \`${message.guild.commandPrefix}note list\`
To delete a note: \`${message.guild.commandPrefix}note delete (ID)\``);
      }
    }
  }
};

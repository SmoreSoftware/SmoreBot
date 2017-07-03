//eslint-disable-next-line
/*eslint-disable
//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const ascii = require('image-to-ascii');

module.exports = class ImgAsciiCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'imgascii',
      aliases: ['imgasciiart', 'imgtoascii'],
      group: 'fun',
      memberName: 'imgascii',
      description: 'Turns an image into ascii art.',
      details: oneLine `
        Do you like ascii art? Is text not enough for you?
        This command converts an image to ascii art.
        Awwwww yeaah.
			`,
      examples: ['imgascii https://cdn.discordapp.com/attachments/324656649665118209/328609768044494849/codercat.jpg'],
      args: [{
        key: 'toAscii',
        label: 'image',
        prompt: 'What image would you like to convert to ascii art?',
        type: 'string',
        infinite: false
      }]
    })
  }

  //eslint-disable-next-line class-methods-use-this
  async run(message, args) {

    This commmand is currenrly non-functional.
    Messages were too long and it spit out garbage to the console.
    ascii(args.toAscii, (err, converted) => {
      if (err) {
        message.reply('Something went wrong! Contact a developer.')
        console.error(err)
      }
      //message.channel.send(`${converted}`).catch(message.reply('Something went wrong! Contact a developer. \nIt\'s likely that your image was too large to send.'))
      console.log(converted)
    })

    message.reply('This command is curently broken.')
  }
};
*/

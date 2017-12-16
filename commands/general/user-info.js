const commando = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class UserInfoCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'user-info',
			aliases: ['user'],
			group: 'main',
			memberName: 'user-info',
			description: 'Gets information about a user.',
			examples: ['user-info @Chronomly#8108 ', 'user-info Chronomly'],
			guildOnly: true,

			args: [
				{
					key: 'member',
					label: 'user',
					prompt: 'What user would you like to retrieve info on?',
					type: 'member'
				}
			]
		});
	}

	async run(msg, args) {
		const member = args.member;
		const user = member.user;
		const embed = new RichEmbed()
		.setThumbnail(user.avatarURL)
		.setDescription(`Info on **${user.tag}** (ID: ${user.id})`)
        .setTitle(user.tag)
        .addField('🛡️ **Guild-based Info:**', ` ${member.nickname !== null ? `Nickname: ${member.nickname}` : 'Nickname: No nickname'}\nRoles: ${member.roles.map(roles => `\`${roles.name}\``).join(', ')}\nJoined at: ${member.joinedAt}`)
		.addField('🚶 **User Info:**', `Created at: ${user.createdAt}\n${user.bot ? 'Account Type: Bot' : 'Account Type: User'}\nStatus: ${user.presence.status}\nGame: ${user.presence.game ? user.presence.game.name : 'None'}`)
		.setFooter(`Powered by ${this.client.user.username}`);
		return msg.channel.send({ embed: embed });
	}
};

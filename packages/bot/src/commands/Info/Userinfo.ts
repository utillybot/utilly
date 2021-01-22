import {
	BaseCommand,
	BotPermsValidatorHook,
	Command,
	CommandContext,
	EmbedBuilder,
	PreHook,
} from '@utilly/framework';
import { Member, User } from 'eris';

@Command({
	name: 'Userinfo',
	description: 'View information about yourself',
	triggers: ['uinfo'],
})
@PreHook(BotPermsValidatorHook({ permissions: ['embedLinks'] }))
export default class Userinfo extends BaseCommand {
	async execute({ message }: CommandContext): Promise<void> {
		let member: Member | undefined;
		const user: User = message.author;

		if (message.member) {
			member = message.member;
		}

		const embed = new EmbedBuilder();
		embed.setTitle('User Info');
		embed.addField('Username', user.username, true);
		embed.addField('Discriminator', user.discriminator, true);
		embed.addField('Bot', user.bot ? 'Yes' : 'No', true);
		embed.addField('Mention', user.mention, true);
		embed.addField('ID', user.id, true);
		embed.addField('Created At', new Date(user.createdAt).toUTCString());
		embed.setThumbnail(user.dynamicAvatarURL('png', 1024));
		if (member) {
			if (member.nick) embed.addField('Nickname', member.nick, true);
			embed.addField('Joined At', new Date(member.joinedAt).toUTCString());
		}

		message.channel.createMessage({ embed });
	}
}

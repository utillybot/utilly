import type { CommandContext } from '@utilly/framework';
import {
	BaseCommand,
	BotPermsValidatorHook,
	Command,
	EmbedBuilder,
	PreHook,
} from '@utilly/framework';
import type { Member, User } from 'eris';
import type InfoCommandModule from './moduleinfo';

@Command({
	name: 'Userinfo',
	description: 'View information about yourself',
	triggers: ['uinfo'],
})
@PreHook(BotPermsValidatorHook({ permissions: ['embedLinks'] }))
export default class Userinfo extends BaseCommand {
	parent?: InfoCommandModule;

	async execute(ctx: CommandContext): Promise<void> {
		let member: Member | undefined;
		const user: User = ctx.message.author;

		if (ctx.guild) {
			member = ctx.member;
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

		ctx.reply({ embed });
	}
}

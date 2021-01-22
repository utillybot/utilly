import {
	BaseCommand,
	BotPermsValidatorHook,
	Command,
	CommandContext,
	EmbedBuilder,
	PreHook,
} from '@utilly/framework';

@Command({
	name: 'Privacy',
	description: "Shows the bots' privacy policy",
})
@PreHook(BotPermsValidatorHook({ permissions: ['embedLinks'] }))
export default class Privacy extends BaseCommand {
	async execute({ message }: CommandContext): Promise<void> {
		const embed = new EmbedBuilder();
		embed.setTitle('Privacy Policy');
		embed.setDescription(
			'We collect the guild ids and the settings you set for that guild. For example, this would be whether a modules is enabled or not or channel ids for the log channels. The data will only be used to store your preferences and settings for you guild and not anything else. The data is stored in a database that I, jtsshieh#6424, and my hosting provider have access to. If you have any concerns or want your data removed, send me a DM and I will remove your guild settings. '
		);
		message.channel.createMessage({ embed });
	}
}

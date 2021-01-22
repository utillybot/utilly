import {
	BaseCommand,
	BotPermsValidatorHook,
	Command,
	CommandContext,
	EmbedBuilder,
	isGuildChannel,
	PreHook,
} from '@utilly/framework';

@Command({ name: 'Ping', description: "Check's the bots' ping" })
@PreHook(BotPermsValidatorHook({ permissions: ['embedLinks'] }))
export default class Ping extends BaseCommand {
	async execute({ bot, message }: CommandContext): Promise<void> {
		const ZWS = '​';
		const m = await message.channel.createMessage(ZWS);
		const embed = new EmbedBuilder();
		embed.setTitle('Bot Ping');
		embed.addField(
			'Shard Latency (Server)',
			`${
				isGuildChannel(message.channel)
					? message.channel.guild.shard.latency.toString()
					: bot.shards.get(0)?.latency.toString()
			}ms`,
			true
		);
		embed.addField(
			'Bot Latency (Client)',
			`${m.timestamp - message.timestamp}ms`,
			true
		);
		if (message.member) {
			embed.addField(
				'Shard Id',
				message.member.guild.shard.id.toString(),
				true
			);
		}
		embed.addDefaults(message.author);

		m.edit({ content: '', embed });
	}
}

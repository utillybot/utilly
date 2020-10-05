import type { CommandContext } from '@utilly/framework';
import {
    BaseCommand,
    BotPermsValidatorHook,
    EmbedBuilder,
    Command,
} from '@utilly/framework';
import type GeneralCommandModule from './moduleinfo';

@Command({ name: 'ping', description: "Check's the bots' ping" }, [
    new BotPermsValidatorHook({
        permissions: ['embedLinks'],
    }),
])
export default class Ping extends BaseCommand {
    parent?: GeneralCommandModule;

    async execute(ctx: CommandContext): Promise<void> {
        const ZWS = '​';
        const m = await ctx.reply(ZWS);
        const embed = new EmbedBuilder();
        embed.setTitle('Bot Ping');
        embed.addField(
            'Shard Latency (Server)',
            `${
                ctx.guild
                    ? ctx.guild.shard.latency.toString()
                    : this.bot.shards.get(0)?.latency.toString()
            }ms`,
            true
        );
        embed.addField(
            'Bot Latency (Client)',
            `${m.timestamp - ctx.message.timestamp}ms`,
            true
        );
        if (ctx.message.member != undefined) {
            embed.addField(
                'Shard Id',
                ctx.message.member.guild.shard.id.toString(),
                true
            );
        }
        embed.addDefaults(ctx.message.author);

        m.edit({ content: '', embed });
    }
}

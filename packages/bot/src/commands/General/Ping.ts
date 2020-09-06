import type { CommandContext, UtillyClient } from '@utilly/framework';
import { BaseCommand, EmbedBuilder } from '@utilly/framework';
import type GeneralCommandModule from './moduleinfo';

export default class Ping extends BaseCommand {
    parent?: GeneralCommandModule;

    constructor(bot: UtillyClient, parent: GeneralCommandModule) {
        super(bot, parent);
        this.help.name = 'ping';
        this.help.description = "Checks the bot's ping";
        this.help.usage = '';
        this.settings.guildOnly = false;
        this.permissions.botPerms = ['embedLinks'];
    }

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

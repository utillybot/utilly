import Eris, { Webhook } from 'eris';
import { getCustomRepository } from 'typeorm';
import Guild from '../../../database/entity/Guild';
import GuildRepository from '../../../database/repository/GuildRepository';
import DatabaseModule from '../../framework/handlers/ModuleHandler/Module/DatabaseModule';
import EmbedBuilder from '../../framework/utilities/EmbedBuilder';
import UtillyClient from '../../UtillyClient';

/**
 * Base Logging Module
 */
export default class LoggingModule extends DatabaseModule {
    constructor(bot: UtillyClient) {
        super(bot);
        this.databaseEntry = 'logging';
    }

    /**
     * Selects a guild row for a specific guild with a few columns selected
     * @param guildID - the guild id
     * @param type - the type of the event
     */
    async selectGuildRow(guildID: string, type: string): Promise<Guild> {
        return await getCustomRepository(
            GuildRepository
        ).selectOrCreate(guildID, [
            'logging',
            `logging_${type}Channel`,
            `logging_${type}Event`,
        ]);
    }

    /**
     * Gets the log channel for a specific event in a guild
     * @param guild - the guild to get the channel from
     * @param logChannelID - the id of the channel
     */
    getLogChannel(
        guild: Eris.Guild,
        logChannelID: string | null
    ): Eris.TextChannel | null {
        if (logChannelID == null) return null;

        const logChannel = guild.channels.get(logChannelID);

        if (
            logChannel != null &&
            logChannel != undefined &&
            logChannel instanceof Eris.TextChannel
        ) {
            return logChannel;
        } else {
            return null;
        }
    }

    async sendLogMessage(
        logChannel: Eris.TextChannel,
        content: EmbedBuilder
    ): Promise<void> {
        const webhooks: Webhook[] = await logChannel.getWebhooks();

        for (const webhook of webhooks) {
            if (webhook.name == 'Utilly Logging') {
                this.bot.executeWebhook(webhook.id, webhook.token, {
                    avatarURL: this.bot.user.avatarURL,
                    embeds: [content],
                });
                return;
            }
        }

        const webhook = await logChannel.createWebhook({
            name: 'Utilly Logging',
            avatar:
                'data:image/png;base64,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',
        });

        this.bot.executeWebhook(webhook.id, webhook.token, {
            avatarURL: this.bot.user.avatarURL,
            embeds: [content],
        });
    }
}

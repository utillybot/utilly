import Eris from 'eris';
import { getCustomRepository } from 'typeorm';
import UtillyClient from '../../bot';
import { Guild } from '../../database/entity/Guild';
import GuildRepository from '../../database/repository/GuildRepository';
import DatabaseModule from '../../handlers/ModuleHandler/Module/DatabaseModule';

/**
 * Base Logging Module
 */
export default class LoggingModule extends DatabaseModule {
    constructor(bot: UtillyClient) {
        super(bot);
        this.databaseEntry = 'logging';
    }

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
}

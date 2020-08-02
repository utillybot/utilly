import Eris from 'eris';
import { getCustomRepository, getRepository } from 'typeorm';
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

    async getGuildRow(guild: Eris.Guild): Promise<Guild> {
        return await getCustomRepository(GuildRepository).findOrCreate(
            guild.id
        );
    }

    async selectGuildRow(guild: Eris.Guild, type: string): Promise<Guild> {
        const guildRepository = getRepository(Guild);
        let guildRow = await guildRepository
            .createQueryBuilder('user')
            .where('user.guildID = :id', { id: guild.id })
            .select([
                'user.logging',
                `user.logging_${type}Channel`,
                `user.logging_${type}Event`,
            ])
            .getOne();
        if (guildRow == undefined) {
            guildRow = guildRepository.create();
            guildRow.guildID = guild.id;
            guildRepository.save(guildRow);
        }
        return guildRow;
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

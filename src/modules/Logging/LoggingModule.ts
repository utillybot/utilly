import Eris from 'eris';
import UtillyClient from '../../bot';
import { Guild } from '../../database/models/Guild';
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
        return (
            await Guild.findOrCreate({
                where: { guildID: guild.id },
            })
        )[0];
    }

    /**
     * Checks if an event and the logging module is enabled for a guild
     * @param event - the event name
     * @param guild - the guild object
     */
    async preChecks(
        event: string,
        guild: Eris.Guild,
        guildRow?: Guild
    ): Promise<boolean> {
        if (guildRow == null) {
            [guildRow] = await Guild.findOrCreate({
                where: { guildID: guild.id },
            });
        }

        if (guildRow == null) {
            return false;
        }
        if (!guildRow.logging || !guildRow.get(`logging_${event}`)) {
            return false;
        }
        return true;
    }

    /**
     * Gets the log channel for a specific event in a guild
     * @param type - the type of the log channel
     * @param guild - the guild object
     */
    async getLogChannel(
        type: string,
        guild: Eris.Guild,
        guildRow?: Guild
    ): Promise<Eris.TextChannel | null> {
        if (guildRow == null) {
            [guildRow] = await Guild.findOrCreate({
                where: { guildID: guild.id },
            });
        }
        const logChannelID: number = <number>(
            guildRow.get(`logging_${type}LogChannel`)
        );

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

    async setLogChannel(
        type: string,
        guild: Eris.Guild,
        channelID: string,
        guildRow?: Guild
    ): Promise<void> {
        if (guildRow == null) {
            [guildRow] = await Guild.findOrCreate({
                where: { guildID: guild.id },
            });
        }

        guildRow.set(`logging_${type}LogChannel`, channelID);
        guildRow.save();
    }
}

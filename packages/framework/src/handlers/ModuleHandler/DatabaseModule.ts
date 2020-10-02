import { GuildRepository } from '@utilly/database';
import type { UtillyClient } from '../../UtillyClient';
import { Module } from './Module';

/**
 * A module that is corresponding to a database entry
 */
export abstract class DatabaseModule extends Module {
    databaseEntry: string;

    protected constructor(bot: UtillyClient) {
        super(bot);
        this.databaseEntry = 'none';
    }

    async isEnabled(guildID: string): Promise<boolean> {
        const guildRow = await this.bot.database.connection
            .getCustomRepository(GuildRepository)
            .selectOrCreate(guildID, [this.databaseEntry]);
        const enabled = guildRow[this.databaseEntry];
        if (enabled == null) {
            return false;
        } else if (enabled) {
            return true;
        } else if (!enabled) {
            return false;
        }
        return false;
    }
}

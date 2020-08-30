import { getCustomRepository } from 'typeorm';
import UtillyClient from '../../../../bot/UtillyClient';
import GuildRepository from '../../../../database/repository/GuildRepository';
import Module from './Module';

/**
 * A module that is corrosponding to a database entry
 */
export default abstract class DatabaseModule extends Module {
    databaseEntry: string;

    constructor(bot: UtillyClient) {
        super(bot);
        this.databaseEntry = 'none';
    }

    async isEnabled(guildID: string): Promise<boolean> {
        const guildRow = await getCustomRepository(
            GuildRepository
        ).selectOrCreate(guildID, [this.databaseEntry]);
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

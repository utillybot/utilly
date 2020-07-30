import Eris from 'eris';
import { Guild } from '../../../database/models/Guild';
import Module from './Module';

/**
 * A module that is corrosponding to a database entry
 */
export default abstract class DatabaseModule extends Module {
    databaseEntry: string;

    async isEnabled(guild: Eris.Guild): Promise<boolean> {
        const [guildRow] = await Guild.findOrCreate({
            where: { guildID: guild.id },
        });

        const enabled = guildRow.get(this.databaseEntry);
        if (enabled == null) {
            return false;
        } else if (enabled) {
            return true;
        } else if (!enabled) {
            return false;
        }
    }

    async isEnabledGuild(guild: Eris.Guild, guildRow: Guild): Promise<boolean> {
        const enabled = guildRow.get(this.databaseEntry);
        if (enabled == null) {
            return false;
        } else if (enabled) {
            return true;
        } else if (!enabled) {
            return false;
        }
    }
}

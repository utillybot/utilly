import { EntityRepository, Repository } from 'typeorm';
import { Guild } from '../entity/Guild';

@EntityRepository(Guild)
export default class GuildRepository extends Repository<Guild> {
    /**
     * Finds or create a guild row
     * @param guildID - the guild id
     */
    async findOrCreate(guildID: string): Promise<Guild> {
        let guild = await this.findOne(guildID);
        if (guild == undefined) {
            guild = await this.save({ guildID });
        }
        return guild;
    }

    /**
     * Selects or creates a guild row.
     * @param guildID - the guild id
     * @param select - an array of columns to select
     */
    async selectOrCreate(guildID: string, select: string[]): Promise<Guild> {
        select.push('guildID');
        let guildRow = await this.findOne({
            where: { guildID },
            select: select,
        });

        if (guildRow == undefined) {
            await this.insert({ guildID });
            guildRow = await this.findOne({
                where: { guildID },
                select: select,
            });
            if (guildRow == undefined)
                throw new Error('Failed to create Guild Row');
        }
        return guildRow;
    }
}

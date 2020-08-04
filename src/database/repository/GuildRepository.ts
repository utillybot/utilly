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
            const guildObj = this.create();
            guildObj.guildID = guildID;
            guild = await this.save(guildObj);
        }
        return guild;
    }

    /**
     * Selects or creates a guild row.
     * @param guildID - the guild id
     * @param select - an array of columns to select
     */
    async selectOrCreate(guildID: string, select: string[]): Promise<Guild> {
        const selectItems = select.map(item => 'guild.' + item);
        selectItems.push('guild.guildID');
        let guildRow = await this.createQueryBuilder('guild')
            .where('guild.guildID = :guildID', { guildID })
            .select(selectItems)
            .cache(true)
            .getOne();

        if (guildRow == undefined) {
            await this.createQueryBuilder()
                .insert()
                .into(Guild)
                .values({ guildID })
                .execute();
            guildRow = await this.createQueryBuilder('guild')
                .where('guild.guildID = :id', { id: guildID })
                .select(selectItems)
                .getOne();
            if (guildRow == undefined)
                throw new Error('Failed to create Guild Row');
        }
        return guildRow;
    }
}

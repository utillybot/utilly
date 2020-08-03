import { EntityRepository, Repository } from 'typeorm';
import { Guild } from '../entity/Guild';

@EntityRepository(Guild)
export default class GuildRepository extends Repository<Guild> {
    async findOrCreate(guildID: string): Promise<Guild> {
        let guild = await this.findOne(guildID);
        if (guild == undefined) {
            const guildObj = this.create();
            guildObj.guildID = guildID;
            guild = await this.save(guildObj);
        }
        return guild;
    }

    async selectOrCreate(guildID: string, select: string[]): Promise<Guild> {
        const selectItems = select.map(item => 'guild.' + item);
        selectItems.push('guild.guildID');
        let guildRow = await this.createQueryBuilder('guild')
            .where('guild.guildID = :guildID', { guildID })
            .select(selectItems)
            .cache(true)
            .getOne();

        if (guildRow == undefined) {
            guildRow = new Guild();
            guildRow.guildID = guildID;
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

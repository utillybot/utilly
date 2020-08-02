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
}

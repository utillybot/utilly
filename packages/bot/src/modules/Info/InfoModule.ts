import type { UtillyClient } from '@utilly/framework';
import { DatabaseModule } from '@utilly/framework';

export default class InfoModule extends DatabaseModule {
    constructor(bot: UtillyClient) {
        super(bot);
        this.databaseEntry = 'info';
    }
}

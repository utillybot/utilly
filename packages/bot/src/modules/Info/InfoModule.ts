import { DatabaseModule, UtillyClient } from '@utilly/framework';

export default class InfoModule extends DatabaseModule {
    constructor(bot: UtillyClient) {
        super(bot);
        this.databaseEntry = 'info';
    }
}

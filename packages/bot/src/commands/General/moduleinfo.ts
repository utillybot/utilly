import type { UtillyClient } from '@utilly/framework';
import { CommandModule } from '@utilly/framework';
import type GeneralModule from '../../modules/General/GeneralModule';

export default class GeneralCommandModule extends CommandModule {
    parent?: GeneralModule;

    constructor(bot: UtillyClient) {
        super(bot);
        this.info.name = 'General';
        this.info.description = 'General bot commands';
    }
}

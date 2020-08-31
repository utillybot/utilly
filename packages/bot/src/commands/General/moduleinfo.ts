import { CommandModule, UtillyClient } from '@utilly/framework';
import GeneralModule from '../../modules/General/GeneralModule';

export default class GeneralCommandModule extends CommandModule {
    parent?: GeneralModule;

    constructor(bot: UtillyClient) {
        super(bot);
        this.info.name = 'General';
        this.info.description = 'General bot commands';
    }
}

import { CommandModule, UtillyClient } from '@utilly/framework';
import InfoModule from '../../modules/Info/InfoModule';

export default class InfoCommandModule extends CommandModule {
    parent?: InfoModule;

    constructor(bot: UtillyClient) {
        super(bot);
        this.info.name = 'Info';
        this.info.description = 'View info about discord entities';
    }
}

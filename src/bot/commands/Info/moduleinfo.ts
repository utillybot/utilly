import CommandModule from '../../framework/handlers/CommandHandler/CommandModule';
import InfoModule from '../../modules/Info/InfoModule';
import UtillyClient from '../../UtillyClient';

export default class InfoCommandModule extends CommandModule {
    parent?: InfoModule;

    constructor(bot: UtillyClient) {
        super(bot);
        this.info.name = 'Info';
        this.info.description = 'View info about discord entities';
    }
}

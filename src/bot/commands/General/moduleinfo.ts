import CommandModule from '../../framework/handlers/CommandHandler/CommandModule';
import GeneralModule from '../../modules/General/GeneralModule';
import UtillyClient from '../../UtillyClient';

export default class GeneralCommandModule extends CommandModule {
    parent?: GeneralModule;

    constructor(bot: UtillyClient) {
        super(bot);
        this.info.name = 'General';
        this.info.description = 'General bot commands';
    }
}

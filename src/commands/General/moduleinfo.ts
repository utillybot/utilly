import CommandModule from '../../handlers/CommandHandler/CommandModule/CommandModule';
import GeneralModule from '../../modules/General/GeneralModule';

export default class GeneralCommandModule extends CommandModule {
    parent?: GeneralModule;

    constructor() {
        super();
        this.info.name = 'General';
        this.info.description = 'General bot commands';
    }
}

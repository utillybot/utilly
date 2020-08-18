import CommandModule from '../../framework/handlers/CommandHandler/CommandModule/CommandModule';
import LoggingModule from '../../modules/Logging/LoggingModule';
import UtillyClient from '../../UtillyClient';

export default class LoggingCommandModule extends CommandModule {
    parent?: LoggingModule;

    constructor(bot: UtillyClient) {
        super(bot);
        this.info.name = 'Logging';
        this.info.description = 'General bot commands';
    }
}

import CommandModule from '../../handlers/CommandHandler/CommandModule/CommandModule';
import LoggingModule from '../../modules/Logging/LoggingModule';

export default class LoggingCommandModule extends CommandModule {
    parent?: LoggingModule;

    constructor() {
        super();
        this.info.name = 'Logging';
        this.info.description = 'General bot commands';
    }
}

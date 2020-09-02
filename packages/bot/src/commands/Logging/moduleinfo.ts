import type { UtillyClient } from '@utilly/framework';
import { CommandModule } from '@utilly/framework';
import type LoggingModule from '../../modules/Logging/LoggingModule';

export default class LoggingCommandModule extends CommandModule {
    parent?: LoggingModule;

    constructor(bot: UtillyClient) {
        super(bot);
        this.info.name = 'Logging';
        this.info.description = 'General bot commands';
    }
}

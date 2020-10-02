import type { UtillyClient } from '@utilly/framework';
import { CommandModule, IsModuleEnabledHook } from '@utilly/framework';
import type LoggingModule from '../../modules/Logging/LoggingModule';

export default class LoggingCommandModule extends CommandModule {
    parent!: LoggingModule;

    constructor(bot: UtillyClient) {
        super(bot);
        this.info.name = 'Logging';
        this.info.description = 'General bot commands';
    }

    moduleLinked(): void {
        this.preHooks.push(
            new IsModuleEnabledHook({ databaseModule: this.parent })
        );
    }
}

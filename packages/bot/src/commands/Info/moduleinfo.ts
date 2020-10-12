import type { UtillyClient } from '@utilly/framework';
import { CommandModule, IsModuleEnabledHook } from '@utilly/framework';
import type InfoModule from '../../modules/Info/InfoModule';

export default class InfoCommandModule extends CommandModule {
    parent!: InfoModule;

    constructor(bot: UtillyClient) {
        super(bot);
        this.info.name = 'Info';
        this.info.description = 'View info about discord entities';
    }

    moduleLinked() {
        this.preHooks.push(
            IsModuleEnabledHook({ databaseModule: this.parent })
        );
    }
}

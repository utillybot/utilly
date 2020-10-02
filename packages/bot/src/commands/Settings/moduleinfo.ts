import type { UtillyClient } from '@utilly/framework';
import { CommandModule } from '@utilly/framework';

export default class SettingsCommandModule extends CommandModule {
    constructor(bot: UtillyClient) {
        super(bot);
        this.info.name = 'Settings';
        this.info.description = 'Modify settings for all modules.';
    }
}

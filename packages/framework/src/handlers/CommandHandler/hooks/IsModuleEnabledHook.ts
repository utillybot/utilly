import type { CommandHookContext, CommandHookNext } from '../CommandHook';
import { CommandHook } from '../CommandHook';
import { GuildChannel } from 'eris';
import type { DatabaseModule } from '../../..';

export interface IsModuleEnabledHookSettings {
    databaseModule: DatabaseModule;
}

export class IsModuleEnabledHook extends CommandHook {
    settings: IsModuleEnabledHookSettings;

    constructor(settings: IsModuleEnabledHookSettings) {
        super();
        this.settings = settings;
    }

    async run(
        { message }: CommandHookContext,
        next: CommandHookNext
    ): Promise<void> {
        if (
            message.channel instanceof GuildChannel &&
            (await this.settings.databaseModule.isEnabled(
                message.channel.guild.id
            ))
        ) {
            next();
        }
    }
}

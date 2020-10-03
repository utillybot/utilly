import type { CommandHookContext, CommandHookNext } from '../CommandHook';
import { CommandHook } from '../CommandHook';
import { GuildChannel } from 'eris';
import type { DatabaseModule } from '../../..';

/**
 * Settings for the is module enabled hook
 */
export interface IsModuleEnabledHookSettings {
    /**
     * The backend database module to check if it's enabled
     */
    databaseModule: DatabaseModule;
}

/**
 * A hook to check if a database module is enabled
 */
export class IsModuleEnabledHook extends CommandHook {
    /**
     * The settings for this hook
     */
    settings: IsModuleEnabledHookSettings;

    constructor(settings: IsModuleEnabledHookSettings) {
        super();
        this.settings = settings;
    }

    async execute(
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

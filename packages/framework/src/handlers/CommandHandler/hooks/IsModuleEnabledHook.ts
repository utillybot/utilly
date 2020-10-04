import type { CommandHookContext } from '../CommandHook';
import { CommandHook } from '../CommandHook';
import { GuildChannel } from 'eris';
import type { DatabaseModule } from '../../..';
import type { NextFunction } from '../../Hook';

/**
 * Settings for the is module enabled hook
 */
export interface IsModuleEnabledHookSettings {
    /**
     * The backend database module to check if it's enabled
     */
    databaseModule: DatabaseModule;
}

export interface IsModuleEnabledHook {
    settings: IsModuleEnabledHookSettings;
}

/**
 * A hook to check if a database module is enabled
 */
export class IsModuleEnabledHook extends CommandHook {
    async execute(
        { message }: CommandHookContext,
        next: NextFunction
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

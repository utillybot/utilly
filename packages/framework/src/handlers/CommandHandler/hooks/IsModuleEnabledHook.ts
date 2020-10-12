import type { CommandHook } from '../CommandHook';
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
 *
 * @param settings - the settings for this hook
 */
export const IsModuleEnabledHook = (
    settings: IsModuleEnabledHookSettings
): CommandHook => {
    return async ({ message }, next): Promise<void> => {
        if (
            message.channel instanceof GuildChannel &&
            (await settings.databaseModule.isEnabled(message.channel.guild.id))
        ) {
            next();
        }
    };
};

import type { CommandHook } from '../CommandHook';

/**
 * Settings for the or hook
 */
interface OrHookSettings {
    /**
     * An array of hooks to check for
     */
    hooks: CommandHook[];
}

/**
 * A hook to check if any of the passed in hooks call the next() function
 *
 * @param settings - the settings for this hook
 */
export const OrHook = (settings: OrHookSettings): CommandHook => {
    return ({ bot, message, args }, next): void => {
        let hit = false;
        for (const hook of settings.hooks) {
            hook({ bot: bot, message, args }, () => (hit = true));
            if (hit) next();
        }
    };
};

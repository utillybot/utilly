import type { CommandHookContext, CommandHookNext } from '../CommandHook';
import { CommandHook } from '../CommandHook';

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
 */
export class OrHook extends CommandHook {
    /**
     * The settings for this hook
     */
    settings: OrHookSettings;

    constructor(settings: OrHookSettings) {
        super();
        this.settings = settings;
    }

    execute(
        { bot, message, args }: CommandHookContext,
        next: CommandHookNext
    ): void {
        let hit = false;
        for (const hook of this.settings.hooks) {
            hook.execute({ bot: bot, message, args }, () => (hit = true));
            if (hit) next();
        }
    }
}

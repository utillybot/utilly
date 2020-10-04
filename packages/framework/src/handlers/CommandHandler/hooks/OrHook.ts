import type { CommandHookContext } from '../CommandHook';
import { CommandHook } from '../CommandHook';
import type { NextFunction } from '../../Hook';

/**
 * Settings for the or hook
 */
interface OrHookSettings {
    /**
     * An array of hooks to check for
     */
    hooks: CommandHook[];
}

export interface OrHook {
    /**
     * The settings for this hook
     */
    settings: OrHookSettings;
}

/**
 * A hook to check if any of the passed in hooks call the next() function
 */
export class OrHook extends CommandHook {
    execute(
        { bot, message, args }: CommandHookContext,
        next: NextFunction
    ): void {
        let hit = false;
        for (const hook of this.settings.hooks) {
            hook.execute({ bot: bot, message, args }, () => (hit = true));
            if (hit) next();
        }
    }
}

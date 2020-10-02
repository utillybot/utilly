import type { CommandHookContext, CommandHookNext } from '../CommandHook';
import { CommandHook } from '../CommandHook';

interface OrHookSettings {
    hooks: CommandHook[];
}

export class OrHook extends CommandHook {
    settings: OrHookSettings;

    constructor(settings: OrHookSettings) {
        super();
        this.settings = settings;
    }

    run(
        { client, message, args }: CommandHookContext,
        next: CommandHookNext
    ): void {
        let hit = false;
        for (const hook of this.settings.hooks) {
            hook.run({ client, message, args }, () => (hit = true));
            if (hit) next();
        }
    }
}

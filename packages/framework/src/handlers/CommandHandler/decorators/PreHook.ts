import type { CommandHook } from '../CommandHook';

export function PreHook(preHook: CommandHook) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function <
        T extends new (...args: any[]) => { preHooks: CommandHook[] }
    >(constructor: T): T {
        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                this.preHooks ? this.preHooks.unshift(preHook) : [preHook];
            }
        };
    };
}

import type { NextFunction } from './Hook';
import { Hook } from './Hook';

export interface FunctionalHookSettings<T> {
    executor: (ctx: T) => Promise<boolean>;
}

export interface FunctionalHook<T> {
    settings: FunctionalHookSettings<T>;
}

export class FunctionalHook<T> extends Hook<T> {
    async execute(ctx: T, next: NextFunction): Promise<void> {
        const result = await this.settings.executor(ctx);
        if (result) next();
    }
}

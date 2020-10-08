export type NextFunction = () => void;

/**
 * Hooks are functions that execute before or after another is run.
 * It can inhibit the execution of the other function.
 * It can change the results passed into that other function.
 * It can perform cleanup tasks after the other function is run.
 *
 * Hooks follow a similar pattern to express middleware. The default implementation with the `runHooks` function works as follows:
 * When a hook is finished and wants to move onto the next hook, it should call the `next` function.
 * If it does not want to move on, it should do nothing or return out of the execute function.
 *
 * It is possible to not use the default implementation and create your own implementation of the next function.
 */
export abstract class Hook<T> {
    settings: unknown;

    constructor(settings: unknown) {
        this.settings = settings;
    }

    /**
     * Executes this hook
     * @param ctx - the hook context to execute this hook with
     * @param next - a function that will allow the next hook to be executed
     */
    abstract execute(ctx: T, next: NextFunction): void | Promise<void>;
}

/**
 * Runs the hooks in the list and returns if any failed as a boolean
 * @param ctx - the command hook context to pass into the hooks
 * @param hooks - the hooks to run
 */
export const runHooks = async <T extends Hook<J>, J>(
    ctx: J,
    hooks: T[]
): Promise<boolean> => {
    let i = 0;
    const next = async () => {
        const hook = hooks[i++];
        if (hook) await hook.execute(ctx, next);
    };
    await next();

    return i == hooks.length + 1;
};

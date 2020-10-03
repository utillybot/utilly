import type { Client, Message } from 'eris';

/**
 * The next function for a command hook
 */
export type CommandHookNext = () => void;

/**
 * An object containing the client, message, and arguments for a command hook
 */
export interface CommandHookContext {
    /**
     * The client that this hook belongs to
     */
    bot: Client;
    /**
     * The message this hook was run on
     */
    message: Message;
    /**
     * The arguments passed into the command
     */
    args: string[];
}

/**
 * A function that is run somewhere during a command lifecycle that can inhibit the command from being executed or modify the message/args passed into the command.
 */
export abstract class CommandHook {
    /**
     * Executes this hook
     * @param ctx - the command hook context to execute this hook with
     * @param next - a function that will allow the next hook to be executed
     */
    abstract execute(
        ctx: CommandHookContext,
        next: CommandHookNext
    ): void | Promise<void>;
}

/**
 * Runs the command hooks in the list and gives a result if any failed
 * @param ctx - the command hook context to pass into the hooks
 * @param hooks - the hooks to run
 */
export const runCommandHooks = async (
    ctx: CommandHookContext,
    hooks: CommandHook[]
): Promise<boolean> => {
    const { bot, message, args } = ctx;
    let i = 0;
    const next = async () => {
        const hook = hooks[i++];
        if (hook) await hook.execute({ bot: bot, message, args }, next);
    };
    await next();

    return i == hooks.length + 1;
};

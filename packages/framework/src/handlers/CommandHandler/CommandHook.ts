import type { Client, Message } from 'eris';

export type CommandHookNext = () => void;

export interface CommandHookContext {
    client: Client;
    message: Message;
    args: string[];
}

export abstract class CommandHook {
    abstract run(
        ctx: CommandHookContext,
        next: CommandHookNext
    ): void | Promise<void>;
}

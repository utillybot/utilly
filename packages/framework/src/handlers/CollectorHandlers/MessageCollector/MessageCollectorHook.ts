import type { Client, Message } from 'eris';
import { Hook } from '../../Hook';

export interface MessageCollectorHookContext {
    bot: Client;
    message: Message;
}

export abstract class MessageCollectorHook extends Hook<
    MessageCollectorHookContext
> {}

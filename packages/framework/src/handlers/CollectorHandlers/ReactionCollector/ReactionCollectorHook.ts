import type { Client, Emoji, Message } from 'eris';
import { Hook } from '../../Hook';

export interface ReactionCollectorHookContext {
    bot: Client;
    message: Message;
    emoji: Emoji;
    reactor: string;
}

export abstract class ReactionCollectorHook extends Hook<
    ReactionCollectorHookContext
> {}

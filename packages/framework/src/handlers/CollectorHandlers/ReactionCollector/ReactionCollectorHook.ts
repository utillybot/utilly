import type { Client, Emoji, Message } from 'eris';
import { Hook } from '../../Hook';

/**
 * An object containing the client, message, emoji, and reactor id for a reaction collector hook
 */
export interface ReactionCollectorHookContext {
    /**
     * The client this hook belongs to
     */
    bot: Client;

    /**
     * The message that was reacted on
     */
    message: Message;
    /**
     * The emoji that the message was reacted with
     */
    emoji: Emoji;
    /**
     * The id of the person of added the reaction
     */
    reactor: string;
}

/**
 * A hook for a reaction collector
 */
export abstract class ReactionCollectorHook extends Hook<
    ReactionCollectorHookContext
> {}

import type { Client, Message } from 'eris';
import type { Hook } from '../../Hook';

/**
 * An object containing the client and message when a message gets collected by the message collector
 */
export interface MessageCollectorHookContext {
	/**
	 * The client this hook belongs to
	 */
	bot: Client;
	/**
	 * The message that was collected
	 */
	message: Message;
}

/**
 * A hook for a message collector
 */
export type MessageCollectorHook = Hook<MessageCollectorHookContext>;

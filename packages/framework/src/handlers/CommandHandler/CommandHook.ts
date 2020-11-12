import type { Client, Message } from 'eris';
import type { Hook } from '../Hook';
import type { UtillyClient } from '../../UtillyClient';

/**
 * An object containing the client, message, and arguments for a command hook
 */
export interface CommandHookContext {
	/**
	 * The client that this hook belongs to
	 */
	bot: UtillyClient;
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
export type CommandHook = Hook<CommandHookContext>;

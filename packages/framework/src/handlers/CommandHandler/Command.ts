import { Client, Message } from 'eris';
import { CommandHook } from './CommandHook';

/**
 * Help information for this command
 */
export interface CommandInfo {
	/**
	 * The name of the command. A lowercased version will be used as a trigger
	 */
	name: string;
	/**
	 * The description of the command
	 */
	description: string;
	/**
	 * The usage of the command
	 */
	usage: string;
	/**
	 * An array of triggers to trigger the execution of this command. The lowercased name is automatically included
	 */
	triggers: string[];
}

export interface CommandArgument {
	name: string;
	description: string;
	example: string;
	optional: boolean;
	parser: unknown;
}

/**
 * The context the command was run in
 */
export interface CommandContext {
	/**
	 * The client this command belongs to
	 */
	readonly bot: Client;

	/**
	 * The message of this context
	 */
	readonly message: Message;

	/**
	 * The arguments passed into this command
	 */
	readonly args: string[];
}

/**
 * A Command
 */
export abstract class BaseCommand {
	/**
	 * A CommandHelp object of help info for this command
	 */
	info: CommandInfo = {
		name: '',
		description: 'No Description Provided',
		usage: '',
		triggers: [],
	};

	/**
	 * An array of command hooks that will be run prior to the execution of this command.
	 */
	preHooks: CommandHook[] = [];

	/**
	 * Executes this command with the given command context
	 * @param ctx - the command context this command was run in
	 */
	abstract execute(ctx: CommandContext): void | Promise<void>;
}

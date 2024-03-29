import { Database, GuildRepository } from '@utilly/database';
import { Logger } from '@utilly/utils';
import { Client, GuildChannel, Message } from 'eris';
import { EmbedBuilder } from '../../utils/EmbedBuilder';
import { BaseCommand, CommandContext, CommandInfo } from './Command';
import { CommandHook, CommandHookContext } from './CommandHook';
import { runHooks } from '../Hook';

/**
 * A sub command
 */
export abstract class Subcommand {
	/**
	 * A CommandHelp object of help info for this command
	 */
	readonly help: CommandInfo;

	/**
	 * An array of command hooks that will be run prior to the execution of this command.
	 */
	readonly preHooks: CommandHook[];

	/**
	 * Create a new command
	 */
	protected constructor() {
		this.help = {
			name: '',
			description: 'No Description Provided',
			usage: '',
			triggers: [],
		};

		this.preHooks = [];
	}

	/**
	 * Executes this sub command with the given command context
	 * @param ctx - the command context this command was run in
	 */
	abstract execute(ctx: CommandContext): Promise<void>;
}

/**
 * Handles Subcommands on request from a Command
 */
export class SubcommandHandler {
	/**
	 * A list of global pre hooks that will be run as pre hooks for any sub commands registered to this handler
	 */
	readonly preHooks: CommandHook[] = [];

	private readonly _subCommandMap: Map<string, Subcommand> = new Map();

	/**
	 * Creates a new sub command handler
	 * @param _logger - the logger to use
	 * @param _bot - the UtillyClient instance
	 * @param _database - the database to use
	 */
	constructor(
		private _logger: Logger,
		private readonly _bot: Client,
		private readonly _database: Database
	) {}

	/**
	 * Handles an incoming command and translates it to a subcommand
	 * @param ctx - the command context
	 * @returns a boolean of whether a subcommand was found
	 */
	async handle(ctx: CommandContext): Promise<boolean> {
		const command = ctx.args[0];
		const subCommand = this._subCommandMap.get(command);
		if (subCommand == undefined) return false;

		const newArgs = [...ctx.args];
		newArgs.shift();

		const newCtx = { bot: this._bot, message: ctx.message, args: newArgs };
		const hookCtx: CommandHookContext = {
			bot: this._bot,
			message: ctx.message,
			args: newArgs,
		};
		if (!(await runHooks(hookCtx, subCommand.preHooks.concat(this.preHooks))))
			return true;

		await subCommand.execute(newCtx);
		return true;
	}

	/**
	 * Registers a subcommand to this handler
	 * @param command - the subcommand
	 */
	registerSubcommand(command: Subcommand): void {
		this._subCommandMap.set(command.help.name, command);
		this._logger.handler(`      Loading subcommand ${command.help.name}`);
	}

	/**
	 * Get a sub command from this module
	 * @param name - the name of the subcommand
	 */
	getCommand(name: string): Subcommand | undefined {
		return this._subCommandMap.get(name);
	}

	/**
	 * Generate a help embed for this sub command handler
	 * @param parentCommand - the parent command of the subcommands
	 * @param message - the message containing the command run
	 */
	async generateHelp(
		parentCommand: BaseCommand,
		message: Message
	): Promise<EmbedBuilder> {
		let guildRow;
		if (message.channel instanceof GuildChannel) {
			guildRow = await this._database.connection
				.getCustomRepository(GuildRepository)
				.selectOrCreate(message.channel.guild.id, ['prefix']);
		}
		const embed = new EmbedBuilder();
		embed.setTitle(`Help for \`${parentCommand.info.name}\`'s subcommands`);
		embed.setDescription(parentCommand.info.description);
		for (const [name, subCommand] of this._subCommandMap) {
			embed.addField(
				`\`${guildRow ? (guildRow.prefix ? guildRow.prefix[0] : 'u!') : 'u!'}${
					parentCommand.info.name
				} ${name}${subCommand.help.usage ? ' ' + subCommand.help.usage : ''}\``,
				subCommand.help.description
			);
		}
		embed.addDefaults(message.author);

		return embed;
	}
}

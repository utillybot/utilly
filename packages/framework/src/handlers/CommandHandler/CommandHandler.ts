import { Database, GuildRepository } from '@utilly/database';
import { Logger } from '@utilly/utils';
import { Client, GuildChannel, Message } from 'eris';
import fs from 'fs/promises';
import path from 'path';
import { BaseCommand } from './Command';
import { BaseCommandModule } from './CommandModule';
import { CommandHookContext } from './CommandHook';
import { runHooks } from '../Hook';
import { Handler } from '../Handler';
import { loadCommandModuleMetadata, loadPreHookMetadata } from './decorators';
import { GlobalStore, Inject, Injectable } from '@utilly/di';
import { CLIENT_TOKEN } from '../../InjectionTokens';

/**
 * A handler that will handle all incoming commands to the bot
 */
@Injectable()
export class CommandHandler implements Handler {
	/**
	 * A map of command modules registered to this handler
	 */
	readonly commandModules: Map<string, BaseCommandModule> = new Map();

	/**
	 * A map of the registered commands registered to this handler
	 */
	readonly triggers: Map<string, BaseCommand> = new Map();

	/**
	 * Creates a new CommandHandler
	 * @param _bot - the Client instance
	 * @param _logger - the logger
	 * @param _database - the database instance
	 */
	constructor(
		@Inject(CLIENT_TOKEN) private _bot: Client,
		private _logger: Logger,
		private _database: Database
	) {}

	/**
	 * Attaches to the client to start listening for events
	 */
	attach(): void {
		this._bot.on('messageCreate', this._messageCreate.bind(this));
	}

	registerCommandModule(commandModule: BaseCommandModule): CommandHandler {
		loadCommandModuleMetadata(commandModule);
		loadPreHookMetadata(commandModule);

		this.commandModules.set(
			commandModule.info.name.toLowerCase(),
			commandModule
		);

		for (const [trigger, cmd] of commandModule.triggers) {
			this.triggers.set(trigger, cmd);
		}
		return this;
	}

	/**
	 * Loads commands from a directory
	 * @param directory - the directory to load commands from
	 */
	async loadCommands(directory: string): Promise<void> {
		this._logger.handler(`Loading Commands in Directory ${directory}.`);
		const modules = await fs.readdir(directory);

		for (const module of modules) {
			const commands = (
				await fs.readdir(path.join(directory, module))
			).filter(value => value.endsWith('.js'));

			this._logger.handler(`  Loading Command Module "${module}".`);

			const moduleObj: BaseCommandModule = GlobalStore.resolve(
				(await import(path.join(directory, module, 'moduleinfo'))).default
			);

			for (const command of commands) {
				if (command == 'moduleinfo.js') continue;

				this._logger.handler(`    Loading Command "${command}".`);
				const commandObj: BaseCommand = GlobalStore.resolve(
					(await import(path.join(directory, module, command))).default
				);

				moduleObj.registerCommand(commandObj);
				this._logger.handler(
					`    Finished Loading Command "${commandObj.info.name}".`
				);
			}

			this.registerCommandModule(moduleObj);
			this._logger.handler(
				`  Finished Loading Module "${moduleObj.info.name}".`
			);
		}
		this._logger.handler(
			`Command Loading is complete. ${this.commandModules.size} command modules have been loaded.`
		);
	}

	/**
	 * Processes a message when it reaches the bot
	 * @param message - the message
	 */
	private async _messageCreate(message: Message): Promise<void> {
		if (message.author.bot) return;

		if (
			message.channel instanceof GuildChannel &&
			!message.channel.permissionsOf(this._bot.user.id).has('sendMessages')
		)
			return;

		//#region prefix
		let prefix: string | undefined = undefined;
		let prefixes: string[] = [
			`<@${this._bot.user.id}>`,
			`<@!${this._bot.user.id}>`,
		];

		if (message.channel instanceof GuildChannel) {
			const guildRow = await this._database.connection
				.getCustomRepository(GuildRepository)
				.selectOrCreate(message.channel.guild.id, ['prefix']);
			prefixes = prefixes.concat(guildRow.prefix);
		} else {
			prefixes.push('u!');
		}
		for (const prefixElement of prefixes) {
			if (message.content.toLowerCase().startsWith(prefixElement)) {
				prefix = prefixElement;
				break;
			}
		}
		if (!prefix) return;
		//#endregion

		//#region command discovery
		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const command = args.shift();
		if (!command) return;

		const commandObj = this.triggers.get(command.toLowerCase());

		if (commandObj == undefined) return;
		//#endregion

		const hookCtx: CommandHookContext = { bot: this._bot, message, args };

		let parent;
		for (const [, mod] of this.commandModules) {
			if (mod.triggers.has(command.toLowerCase())) {
				parent = mod;
				break;
			}
		}

		try {
			if (!parent)
				throw new Error(`Missing parent in ${commandObj.info.name}.`);
			if (
				!(await runHooks(hookCtx, parent.preHooks.concat(commandObj.preHooks)))
			)
				return;

			await commandObj.execute({ bot: this._bot, message, args });
		} catch (e) {
			console.error('Bot command error', e.stack);
		}
	}
}

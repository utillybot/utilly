import { Database } from '@utilly/database';
import { Logger } from '@utilly/utils';
import { ClientOptions } from 'eris';
import { Client } from 'eris';
import path from 'path';
import { CommandHandler, ModuleHandler } from './handlers';

export class UtillyClient {
	commandHandler: CommandHandler;
	moduleHandler: ModuleHandler;
	logger: Logger;
	database: Database;
	bot: Client;

	constructor(
		token: string,
		options: ClientOptions,
		logger: Logger,
		database: Database
	) {
		this.bot = new Client(token, options);
		this.logger = logger;
		this.database = database;

		this.moduleHandler = new ModuleHandler(this, this.logger);
		this.commandHandler = new CommandHandler(
			this.bot,
			this.logger,
			this.database
		);

		this.bot.on('ready', this.readyEvent.bind(this));
	}

	readyEvent(): void {
		this.logger.gateway('Connection has been established successfully.');
	}

	async loadBot(rootDir: string): Promise<void> {
		await this.moduleHandler.loadModules(path.join(rootDir, 'modules'));
		this.moduleHandler.attachModules();

		await this.commandHandler.loadCommands(path.join(rootDir, 'commands'));

		this.commandHandler.attach();
		console.log('');
	}
}

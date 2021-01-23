import { Database } from '@utilly/database';
import { Logger } from '@utilly/utils';
import { ClientOptions } from 'eris';
import { Client } from 'eris';
import path from 'path';
import { CommandHandler, ModuleHandler } from './handlers';
import { GlobalStore, Inject, Injectable } from '@utilly/di';
import { CLIENT_TOKEN } from './InjectionTokens';

@Injectable()
export class UtillyClient {
	commandHandler: CommandHandler;
	moduleHandler: ModuleHandler;
	bot: Client;

	constructor(
		@Inject('utilly:token') token: string,
		@Inject('utilly:options') options: ClientOptions,
		public logger: Logger,
		public database: Database
	) {
		this.bot = new Client(token, options);
		GlobalStore.register(this.bot, CLIENT_TOKEN);

		this.moduleHandler = GlobalStore.resolve(ModuleHandler);
		this.commandHandler = GlobalStore.resolve(CommandHandler);

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

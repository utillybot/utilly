import { Database } from '@utilly/database';
import { Logger } from '@utilly/utils';
import { Client } from 'eris';
import path from 'path';
import { CommandHandler, ModuleHandler } from './handlers';
import { Inject, Service } from '@utilly/di';
import { CLIENT_TOKEN } from './InjectionTokens';

@Service()
export class UtillyClient {
	constructor(
		@Inject(CLIENT_TOKEN) public bot: Client,
		public logger: Logger,
		public database: Database,
		public commandHandler: CommandHandler,
		private _moduleHandler: ModuleHandler
	) {
		this.bot.on('ready', this.readyEvent.bind(this));
	}

	readyEvent(): void {
		this.logger.gateway('Connection has been established successfully.');
	}

	async loadBot(rootDir: string): Promise<void> {
		await this._moduleHandler.loadModules(path.join(rootDir, 'modules'));
		this._moduleHandler.attachModules();

		await this.commandHandler.loadCommands(path.join(rootDir, 'commands'));

		this.commandHandler.attach();
		console.log('');
	}
}

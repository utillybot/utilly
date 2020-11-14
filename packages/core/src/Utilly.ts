import { Database } from '@utilly/database';
import { UtillyClient } from '@utilly/framework';
import { UtillyWeb } from '@utilly/server';
import { Logger } from '@utilly/utils';
import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';
import path from 'path';

export class Utilly {
	protected logger: Logger;
	protected database: Database;
	protected bot: UtillyClient;
	protected web: UtillyWeb;

	constructor() {
		dotenv.config();

		if (!process.env.DATABASE_URL)
			throw new Error('DATABASE_URL env variable not present');
		if (!process.env.TOKEN) throw new Error('TOKEN env variable not present');
		if (!process.env.SENTRY_DSN)
			throw new Error('SENTRY_DSN env variable not present');
		Sentry.init({
			dsn: process.env.SENTRY_DSN,
			tracesSampleRate: 1.0,
			environment: process.env.NODE_ENV,
		});

		this.logger = new Logger({ database: false });
		this.database = new Database(process.env.DATABASE_URL, this.logger);
		this.bot = new UtillyClient(
			'Bot ' + process.env.TOKEN,
			{
				intents: [
					'guilds',
					'guildMembers',
					'guildBans',
					'guildEmojis',
					'guildIntegrations',
					'guildWebhooks',
					'guildInvites',
					'guildVoiceStates',
					'guildMessages',
					'guildMessageReactions',
					'directMessages',
					'directMessageReactions',
				],
				restMode: true,
			},
			this.logger,
			this.database
		);
		this.web = new UtillyWeb(
			parseInt(process.env.PORT ?? '3006'),
			this.logger,
			this.database,
			this.bot
		);

		this.bot.on('error', (error: Error) => {
			Sentry.captureException(error);
			this.logger.error(error.stack ?? error.message);
		});
	}

	async start(rootDir: string): Promise<void> {
		this.database.connect();

		this.bot.loadBot(rootDir);

		this.bot.connect();

		this.web.listen();
	}
}

new Utilly().start(path.join(process.cwd(), 'packages', 'bot', 'dist'));

import { Database } from '@utilly/database';
import { UtillyClient } from '@utilly/framework';
import { UtillyWeb } from '@utilly/server';
import { Logger } from '@utilly/utils';
import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';
import path from 'path';
import { GlobalStore } from '@utilly/di';
import { CLIENT_TOKEN } from '@utilly/framework';
import { Client } from 'eris';

export class Utilly {
	constructor() {
		dotenv.config();

		if (!process.env.TOKEN) throw new Error('TOKEN env variable not present');
		if (!process.env.SENTRY_DSN)
			throw new Error('SENTRY_DSN env variable not present');
		Sentry.init({
			dsn: process.env.SENTRY_DSN,
			tracesSampleRate: 1.0,
			environment: process.env.NODE_ENV,
		});
		GlobalStore.registerInstance(new Logger({ database: false }));

		GlobalStore.registerFactory(
			(logger: Logger) => {
				if (!process.env.DATABASE_URL)
					throw new Error('DATABASE_URL env variable not present');
				return new Database(process.env.DATABASE_URL, logger);
			},
			[Logger]
		);

		GlobalStore.registerInstance(
			new Client('Bot ' + process.env.TOKEN, {
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
			}),
			CLIENT_TOKEN
		);

		GlobalStore.registerFactory(
			(logger: Logger, database: Database, bot: UtillyClient) =>
				new UtillyWeb(
					parseInt(process.env.PORT ?? '3006'),
					logger,
					database,
					bot
				),
			[Logger, Database, UtillyClient]
		);

		GlobalStore.get(CLIENT_TOKEN).on('error', (error: Error) => {
			Sentry.captureException(error);
			GlobalStore.resolve(Logger).error(error.stack ?? error.message);
		});
	}

	async start(rootDir: string): Promise<void> {
		await GlobalStore.resolve(Database).connect();

		GlobalStore.resolve(UtillyClient).loadBot(rootDir);

		GlobalStore.get(CLIENT_TOKEN).connect();

		GlobalStore.resolve(UtillyWeb).listen();
	}
}

new Utilly().start(path.join(process.cwd(), 'packages', 'bot', 'dist'));

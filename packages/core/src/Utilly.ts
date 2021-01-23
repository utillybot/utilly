import { Database } from '@utilly/database';
import { CLIENT_TOKEN, UtillyClient } from '@utilly/framework';
import { UtillyWeb } from '@utilly/server';
import { Logger } from '@utilly/utils';
import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';
import path from 'path';
import { GlobalStore } from '@utilly/di';

export class Utilly {
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

		GlobalStore.register(process.env.DATABASE_URL, 'utilly:database_url');
		GlobalStore.register({ database: false }, 'utilly:logger_settings');
		GlobalStore.register('Bot ' + process.env.TOKEN, 'utilly:token');
		GlobalStore.register(
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
			'utilly:options'
		);

		this.web = new UtillyWeb(
			parseInt(process.env.PORT ?? '3006'),
			GlobalStore.resolve(Logger),
			GlobalStore.resolve(Database),
			GlobalStore.resolve(UtillyClient)
		);
		GlobalStore.resolve(Database);
		GlobalStore.resolve(Logger);
		GlobalStore.resolve(UtillyClient).bot.on('error', (error: Error) => {
			Sentry.captureException(error);
			GlobalStore.resolve(Logger).error(error.stack ?? error.message);
		});
	}

	async start(rootDir: string): Promise<void> {
		await GlobalStore.resolve(Database).connect();

		GlobalStore.resolve(UtillyClient).loadBot(rootDir);

		GlobalStore.resolve(UtillyClient).bot.connect();

		this.web.listen();
	}
}

new Utilly().start(path.join(process.cwd(), 'packages', 'bot', 'dist'));

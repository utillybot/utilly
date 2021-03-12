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
import redis, { RedisClient } from 'redis';

export class Utilly {
	redisClient: RedisClient;

	constructor() {
		dotenv.config();

		if (!process.env.TOKEN) throw new Error('TOKEN env variable not present');
		if (!process.env.SENTRY_DSN)
			throw new Error('SENTRY_DSN env variable not present');
		if (!process.env.REDIS_URL)
			throw new Error('REDIS_URL env variable not present');

		Sentry.init({
			dsn: process.env.SENTRY_DSN,
			tracesSampleRate: 1.0,
			environment: process.env.NODE_ENV,
		});
		this.redisClient = redis.createClient(process.env.REDIS_URL);

		this.redisClient.on('error', error => {
			GlobalStore.resolve(Logger).error(error);
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

		const postGuilds = () => {
			GlobalStore.resolve(Logger).log('Publishing current guilds');
			this.redisClient.publish(
				'guilds',
				JSON.stringify({
					guilds: GlobalStore.get(CLIENT_TOKEN).guilds.map(guild => guild.id),
				})
			);

			this.redisClient.set(
				'stats',
				JSON.stringify({
					guilds: GlobalStore.get(CLIENT_TOKEN).guilds.size,
					users: GlobalStore.get(CLIENT_TOKEN).users.size,
				})
			);
		};
		GlobalStore.get(CLIENT_TOKEN).once('ready', () => {
			postGuilds();

			setInterval(postGuilds, 10 * 1000);
		});

		GlobalStore.get(CLIENT_TOKEN).on('guildCreate', guild => {
			GlobalStore.resolve(Logger).log('Publishing new guild');

			this.redisClient.publish(
				'guildCreate',
				JSON.stringify({ guild: guild.id })
			);
		});
	}

	async start(rootDir: string): Promise<void> {
		await GlobalStore.resolve(Database).connect();

		await GlobalStore.resolve(UtillyClient).loadBot(rootDir);
		this.redisClient.set(
			'commandModules',
			JSON.stringify({
				commandModules: Array.from(
					GlobalStore.resolve(
						UtillyClient
					).commandHandler.commandModules.values()
				).map(mod => {
					return {
						name: mod.info.name,
						description: mod.info.description,
						commands: Array.from(mod.commands.values()).map(cmd => cmd.info),
					};
				}),
			})
		);

		GlobalStore.get(CLIENT_TOKEN).connect();

		//GlobalStore.resolve(UtillyWeb).listen();
	}
}

new Utilly().start(path.join(process.cwd(), 'packages', 'bot', 'dist'));

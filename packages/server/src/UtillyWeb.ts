import type { Database } from '@utilly/database';
import type { UtillyClient } from '@utilly/framework';
import type { Logger } from '@utilly/utils';
import 'reflect-metadata';
import type { Express, NextFunction, Request, Response } from 'express';
import express from 'express';
import path from 'path';

export class UtillyWeb {
	private _port: number;
	private _logger: Logger;
	private app: Express;

	constructor(
		port: number,
		logger: Logger,
		database: Database,
		bot: UtillyClient
	) {
		this._logger = logger;
		this._port = port;
		this.app = express();

		this.app.use((req: Request, res: Response, next: NextFunction) => {
			const test = /\?[^]*\//.test(req.url);
			if (req.url.substr(-1) === '/' && req.url.length > 1 && !test)
				return res.redirect(req.url.slice(0, -1));
			next();
		});

		this.app.use((req: Request, res: Response, next: NextFunction) => {
			if (!req.url.endsWith('.map')) next();
		});

		const apiRouter = express.Router();

		apiRouter.get('/api/stats', (req: Request, res: Response): void => {
			res.status(200).json({
				guilds: bot.guilds.size,
				users: bot.users.size,
			});
		});

		apiRouter.get('/api/commands', (req: Request, res: Response): void => {
			res.status(200).json({
				commandModules: Array.from(
					bot.commandHandler.commandModules.values()
				).map(mod => {
					return {
						name: mod.info.name,
						description: mod.info.description,
						commands: Array.from(mod.commands.values()).map(cmd => cmd.info),
					};
				}),
			});
		});

		this.app.use(apiRouter);

		this.app.use(
			'/static',
			express.static(path.join(process.cwd(), 'packages', 'web', 'public'), {
				redirect: false,
			})
		);
		this.app.use(
			express.static(path.join(process.cwd(), 'packages', 'web', 'dist'), {
				redirect: false,
				index: false,
			})
		);

		this.app.get('*', (req, res) => {
			res.sendFile(
				path.join(process.cwd(), 'packages', 'web', 'dist', 'index.html')
			);
		});
	}

	listen(): void {
		this.app.listen(this._port, () => {
			this._logger.web(`Server is listening on port ${this._port}`);
		});
	}
}

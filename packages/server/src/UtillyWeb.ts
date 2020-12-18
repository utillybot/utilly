import type { Database } from '@utilly/database';
import type { UtillyClient } from '@utilly/framework';
import type { Logger } from '@utilly/utils';
import 'reflect-metadata';
import type { Express } from 'express';
import express from 'express';
import { apiController } from './controllers/APIController';
import { dashboardController } from './controllers/DashboardController';
import { reactController } from './controllers/ReactController';
import { removeTrailingSlash } from './middlewares/removeTrailingSlash';
import { excludeSourceMaps } from './middlewares/excludeSourceMaps';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler';
import session from 'express-session';
import pgsession from 'connect-pg-simple';

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
		if (!process.env.TOKEN_SECRET)
			throw new Error('JWT Token Secret not provided');

		this._logger = logger;
		this._port = port;
		this.app = express();

		this.app.use(
			session({
				name: 'session',
				secret: process.env.TOKEN_SECRET,
				resave: true,
				saveUninitialized: false,

				store: new (pgsession(session))({
					conObject: {
						connectionString: process.env.DATABASE_URL,
						ssl: {
							rejectUnauthorized: false,
						},
					},
				}),
			})
		);
		this.app.use(cookieParser());
		this.app.use(removeTrailingSlash);
		this.app.use(excludeSourceMaps);

		this.app.use('/api', apiController(bot));
		this.app.use('/dashboard', dashboardController(bot));
		this.app.use(reactController());

		this.app.use(errorHandler(logger));
	}

	listen(): void {
		this.app.listen(this._port, () => {
			this._logger.web(`Server is listening on port ${this._port}`);
		});
	}
}

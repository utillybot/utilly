import type { Database } from '@utilly/database';
import type { UtillyClient } from '@utilly/framework';
import type { Logger } from '@utilly/utils';
import type { Express, Request, Response } from 'express';
import express from 'express';
import path from 'path';
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { APIController } from './controllers/APIController';
import { RemoveTrailingSlash } from './middlewares/RemoveTrailingSlash';

export class UtillyWeb {
    static database: Database;
    static bot: UtillyClient;

    private _port: number;
    private _app: Express;
    private _logger: Logger;

    constructor(
        port: number,
        logger: Logger,
        database: Database,
        bot: UtillyClient
    ) {
        UtillyWeb.database = database;
        UtillyWeb.bot = bot;

        this._logger = logger;
        this._port = port;
        this._app = createExpressServer({
            controllers: [APIController],
            middlewares: [RemoveTrailingSlash],
        });
    }

    listen(): void {
        this._app.listen(this._port, () => {
            this._logger.web(`Server is listening on port ${this._port}`);
        });
    }

    load(): void {
        this._app.disable('x-powered-by');

        this._app.use(
            '/static',
            express.static(
                path.join(process.cwd(), 'packages', 'web', 'public'),
                {
                    redirect: false,
                }
            )
        );

        this._app.use(
            '/static',
            express.static(
                path.join(process.cwd(), 'packages', 'web', 'dist'),
                {
                    redirect: false,
                }
            )
        );

        this._app.get('*', (req, res) => {
            res.sendFile(
                path.join(
                    process.cwd(),
                    'packages',
                    'web',
                    'dist',
                    'index.html'
                )
            );
        });

        this._app._router.stack;
    }
}

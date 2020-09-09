import type { Database } from '@utilly/database';
import type { Logger } from '@utilly/utils';
import type { Express, Request, Response } from 'express';
import express from 'express';
import path from 'path';
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';

export class UtillyWeb {
    private _database: Database;
    private _port: number;
    private _app: Express;
    private _logger: Logger;

    constructor(port: number, logger: Logger, database: Database) {
        this._database = database;
        this._logger = logger;
        this._port = port;
        this._app = createExpressServer();
    }

    listen(): void {
        this._app.listen(this._port, () => {
            this._logger.web(`Server is listening on port ${this._port}`);
        });
    }

    load(): void {
        const pages = ['commands', 'about', ''];
        this._app.disable('x-powered-by');

        this._app.use((req, res, next) => {
            const test = /\?[^]*\//.test(req.url);
            if (req.url.substr(-1) === '/' && req.url.length > 1 && !test)
                res.redirect(301, req.url.slice(0, -1));
            else next();
        });

        this._app.use(
            pages.map(page => `/${page}`),
            express.static(
                path.join(process.cwd(), 'packages', 'web', 'public'),
                {
                    redirect: false,
                }
            )
        );

        this._app.use(
            pages.map(page => `/${page}`),
            express.static(
                path.join(process.cwd(), 'packages', 'web', 'dist'),
                {
                    redirect: false,
                }
            )
        );

        this._app.get(
            pages.map(page => `/${page}`),
            (req: Request, res: Response) => {
                res.sendFile(
                    path.join(
                        process.cwd(),
                        'packages',
                        'web',
                        'public',
                        'index.html'
                    )
                );
            }
        );
    }
}

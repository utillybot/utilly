import { Logger } from '@utilly/utils';
import { Connection, createConnection } from 'typeorm';
import { Guild } from './entities/Guild';
import { TypeORMLogger } from './TypeORMLogger';

export class Database {
    connection!: Connection;
    private _logger: Logger;

    constructor(logger: Logger) {
        this._logger = logger;
    }

    async connect(): Promise<void> {
        if (!process.env.DATABASE_URL)
            throw new Error('DATABASE_URL env variable not present');
        this.connection = await createConnection({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
            entities: [Guild],
            logging: true,
            logger: new TypeORMLogger(this._logger),
        });
    }
}

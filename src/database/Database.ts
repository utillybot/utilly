import { createConnection } from 'typeorm';
import Logger from '../bot/utilities/Logger';
import { Guild } from './entity/Guild';

export default class Database {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    async connect(): Promise<void> {
        if (!process.env.DATABASE_URL)
            throw new Error('DATABASE_URL env variable not present');
        if (!process.env.REDIS_URL)
            throw new Error('REDIS_URL env variable not present');
        await createConnection({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
            entities: [Guild],
            logging: true,
            cache: {
                type: 'redis',
                options: {
                    url: process.env.REDIS_URL,
                },
            },
        });
    }
}

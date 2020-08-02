import { createConnection } from 'typeorm';
import Logger from '../helpers/Logger';
import { Guild } from './entity/Guild';

export default class Database {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    async connect(): Promise<void> {
        if (!process.env.DATABASE_URL)
            throw new Error('DATABASE_URL env variable not present');
        await createConnection({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
            entities: [Guild],
            logging: true,
        });
    }
}

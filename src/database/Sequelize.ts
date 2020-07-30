import { Sequelize } from 'sequelize';
import Logger from '../helpers/Logger';

export default class Database {
    sequelize: Sequelize;
    logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
        this.sequelize = new Sequelize(process.env.DATABASE_URL, {
            logging: msg => logger.database(msg),
            dialect: 'postgres',
            ssl: true,
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            },
        });
    }

    async connect(): Promise<void> {
        try {
            await this.sequelize.authenticate();
            this.logger.database(
                'Connection has been established successfully.'
            );
        } catch (error) {
            this.logger.error('Unable to connect to the database:', error);
        }
    }

    async syncModels(): Promise<void> {
        await this.sequelize.sync();
    }

    async alterSyncModels(): Promise<void> {
        await this.sequelize.sync({ alter: true });
    }

    async forceSyncModels(): Promise<void> {
        await this.sequelize.sync({ force: true });
    }
}

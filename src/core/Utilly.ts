import UtillyClient from '../bot/UtillyClient';
import Database from '../database/Database';
import Logger from './Logger';

export default class Utilly {
    logger: Logger;
    database: Database;
    bot: UtillyClient;

    constructor() {
        this.logger = new Logger();
        this.database = new Database(this.logger);
        this.bot = new UtillyClient(this.logger, this.database);
    }

    async start(): Promise<void> {
        this.database.connect();

        this.bot.loadBot();

        this.bot.connect();
    }
}

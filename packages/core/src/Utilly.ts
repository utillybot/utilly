import { Database } from '@utilly/database';
import { UtillyClient } from '@utilly/framework';
import { Logger } from '@utilly/utils';
import path from 'path';

export class Utilly {
    protected logger: Logger;
    protected database: Database;
    protected bot: UtillyClient;

    constructor() {
        this.logger = new Logger();
        this.database = new Database(this.logger);
        this.bot = new UtillyClient(this.logger, this.database);
    }

    async start(rootDir: string): Promise<void> {
        this.database.connect();

        this.bot.loadBot(rootDir);

        this.bot.connect();
    }
}

new Utilly().start(path.join(process.cwd(), 'packages', 'bot', 'dist'));

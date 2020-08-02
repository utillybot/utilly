import dotenv from 'dotenv';
import { Client } from 'eris';
import path from 'path';
import 'reflect-metadata';
import Database from './database/Database';
import CommandHandler from './handlers/CommandHandler/CommandHandler';
import ModuleHandler from './handlers/ModuleHandler/ModuleHandler';
import Logger from './helpers/Logger';

export default class UtillyClient extends Client {
    CommandHandler: CommandHandler;
    ModuleHandler: ModuleHandler;
    logger: Logger;
    database: Database;

    constructor() {
        dotenv.config();
        if (!process.env.TOKEN)
            throw new Error('TOKEN env variable not present');
        super(process.env.TOKEN);
        this.logger = new Logger();
        this.ModuleHandler = new ModuleHandler(this, this.logger);
        this.CommandHandler = new CommandHandler(this, this.logger);
        this.database = new Database(this.logger);

        this.on('ready', this.readyEvent.bind(this));
    }

    async connectDatabase(): Promise<void> {
        await this.database.connect();
    }

    readyEvent(): void {
        this.logger.gateway('Connection has been established successfully.');
    }

    async load(): Promise<void> {
        await this.ModuleHandler.loadModules(path.join(__dirname, 'modules'));
        this.ModuleHandler.attachModules();

        await this.CommandHandler.loadCommands(
            path.join(__dirname, 'commands')
        );
        this.CommandHandler.attach();
        console.log('');

        this.CommandHandler.linkModules(this.ModuleHandler.modules);
        console.log('');

        await this.connectDatabase();
    }
}

const bot = new UtillyClient();
bot.load();
bot.connect();

import dotenv from 'dotenv';
import { Client } from 'eris';
import path from 'path';
import 'reflect-metadata';
import Database from '../database/Database';
import CommandHandler from './handlers/CommandHandler/CommandHandler';
import ModuleHandler from './handlers/ModuleHandler/ModuleHandler';
import { MessageWaitHandler } from './handlers/WaitHandlers/MessageWaitHandler/MessageWaitHandler';
import ReactionWaitHandler from './handlers/WaitHandlers/ReactionWaitHandler/ReactionWaitHandler';
import Logger from './utilities/Logger';

export default class UtillyClient extends Client {
    CommandHandler: CommandHandler;
    ModuleHandler: ModuleHandler;
    MessageWaitHandler: MessageWaitHandler;
    ReactionWaitHandler: ReactionWaitHandler;
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
        this.MessageWaitHandler = new MessageWaitHandler(this, this.logger);
        this.ReactionWaitHandler = new ReactionWaitHandler(this, this.logger);
        this.database = new Database(this.logger);

        this.on('ready', this.readyEvent.bind(this));
    }
    readyEvent(): void {
        this.logger.gateway('Connection has been established successfully.');
    }

    async load(): Promise<void> {
        this.MessageWaitHandler.attach();
        this.ReactionWaitHandler.attach();

        await this.ModuleHandler.loadModules(path.join(__dirname, 'modules'));
        this.ModuleHandler.attachModules();

        await this.CommandHandler.loadCommands(
            path.join(__dirname, 'commands')
        );
        this.CommandHandler.attach();
        console.log('');

        this.CommandHandler.linkModules(this.ModuleHandler.modules);
        console.log('');

        await this.database.connect();
    }
}

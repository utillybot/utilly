import type { Database } from '@utilly/database';
import type { Logger } from '@utilly/utils';
import type { ClientOptions } from 'eris';
import { Client } from 'eris';
import path from 'path';
import { CommandHandler } from './handlers/CommandHandler/CommandHandler';
import { ModuleHandler } from './handlers/ModuleHandler/ModuleHandler';
import { MessageCollectorHandler } from './handlers/CollectorHandlers/MessageCollector/MessageCollectorHandler';
import { ReactionCollectorHandler } from './handlers/CollectorHandlers/ReactionCollector/ReactionCollectorHandler';

export class UtillyClient extends Client {
    commandHandler: CommandHandler;
    moduleHandler: ModuleHandler;
    messageWaitHandler: MessageCollectorHandler;
    reactionWaitHandler: ReactionCollectorHandler;
    logger: Logger;
    database: Database;

    constructor(
        token: string,
        options: ClientOptions,
        logger: Logger,
        database: Database
    ) {
        super(token, options);
        this.logger = logger;
        this.database = database;

        this.moduleHandler = new ModuleHandler(this, this.logger);
        this.commandHandler = new CommandHandler(
            this,
            this.logger,
            this.database
        );
        this.messageWaitHandler = new MessageCollectorHandler(this);
        this.reactionWaitHandler = new ReactionCollectorHandler(this);

        this.on('ready', this.readyEvent.bind(this));
    }

    readyEvent(): void {
        this.logger.gateway('Connection has been established successfully.');
    }

    async loadBot(rootDir: string): Promise<void> {
        this.messageWaitHandler.attach();
        this.reactionWaitHandler.attach();

        await this.moduleHandler.loadModules(path.join(rootDir, 'modules'));
        this.moduleHandler.attachModules();

        await this.commandHandler.loadCommands(path.join(rootDir, 'commands'));

        this.commandHandler.linkModules(this.moduleHandler.modules);
        this.commandHandler.attach();
        console.log('');
    }
}

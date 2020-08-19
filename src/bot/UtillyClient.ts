import dotenv from 'dotenv';
import { Client } from 'eris';
import path from 'path';
import 'reflect-metadata';
import Logger from '../core/Logger';
import Database from '../database/Database';
import CommandHandler from './framework/handlers/CommandHandler/CommandHandler';
import ModuleHandler from './framework/handlers/ModuleHandler/ModuleHandler';
import MessageWaitHandler from './framework/handlers/WaitHandlers/MessageWaitHandler/MessageWaitHandler';
import ReactionWaitHandler from './framework/handlers/WaitHandlers/ReactionWaitHandler/ReactionWaitHandler';

export default class UtillyClient extends Client {
    commandHandler: CommandHandler;
    moduleHandler: ModuleHandler;
    messageWaitHandler: MessageWaitHandler;
    reactionWaitHandler: ReactionWaitHandler;
    logger: Logger;
    database: Database;

    constructor(logger: Logger, database: Database) {
        dotenv.config();
        if (!process.env.TOKEN)
            throw new Error('TOKEN env variable not present');
        super('Bot ' + process.env.TOKEN, {
            intents: [
                'guilds',
                'guildMembers',
                'guildBans',
                'guildEmojis',
                'guildIntegrations',
                'guildWebhooks',
                'guildInvites',
                'guildVoiceStates',
                'guildMessages',
                'guildMessageReactions',
                'directMessages',
                'directMessageReactions',
            ],
            restMode: true,
            compress: true,
        });

        this.logger = logger;
        this.database = database;

        this.moduleHandler = new ModuleHandler(this, this.logger);
        this.commandHandler = new CommandHandler(this, this.logger);
        this.messageWaitHandler = new MessageWaitHandler(this, this.logger);
        this.reactionWaitHandler = new ReactionWaitHandler(this, this.logger);

        this.on('ready', this.readyEvent.bind(this));
    }

    readyEvent(): void {
        this.logger.gateway('Connection has been established successfully.');
    }

    async loadBot(): Promise<void> {
        this.messageWaitHandler.attach();
        this.reactionWaitHandler.attach();

        await this.moduleHandler.loadModules(path.join(__dirname, 'modules'));
        this.moduleHandler.attachModules();

        await this.commandHandler.loadCommands(
            path.join(__dirname, 'commands')
        );

        this.commandHandler.linkModules(this.moduleHandler.modules);
        this.commandHandler.attach();
        console.log('');
    }
}

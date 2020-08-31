import { Database } from '@utilly/database';
import { Logger } from '@utilly/utils';
import dotenv from 'dotenv';
import { Client } from 'eris';
import path from 'path';
import { CommandHandler } from './handlers/CommandHandler/CommandHandler';
import { ModuleHandler } from './handlers/ModuleHandler/ModuleHandler';
import { MessageWaitHandler } from './handlers/WaitHandlers/MessageWaitHandler';
import { ReactionWaitHandler } from './handlers/WaitHandlers/ReactionWaitHandler';

export class UtillyClient extends Client {
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
        this.messageWaitHandler = new MessageWaitHandler(this);
        this.reactionWaitHandler = new ReactionWaitHandler(this);

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

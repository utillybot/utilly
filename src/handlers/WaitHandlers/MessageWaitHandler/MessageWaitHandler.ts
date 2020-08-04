import { Message } from 'eris';
import UtillyClient from '../../../bot';
import Logger from '../../../helpers/Logger';
import { MessageWaitFailure } from './MessageWaitFailure';
import { MessageWaitFilter } from './MessageWaitFilter';
import MessageWaitOptions from './MessageWaitOptions';
import { MessageWaitSuccess } from './MessageWaitSuccess';

export class MessageWaitHandler {
    bot: UtillyClient;
    logger: Logger;
    handlers: Map<string, MessageWaitOptions>;

    constructor(bot: UtillyClient, logger: Logger) {
        this.bot = bot;
        this.logger = logger;
        this.handlers = new Map();
    }

    attach(): void {
        this.bot.on('messageCreate', this.messageCreate.bind(this));
    }

    addListener(
        channelID: string,
        authorID: string,
        success: MessageWaitSuccess,
        filter?: MessageWaitFilter,
        timeout?: number,
        failure?: MessageWaitFailure
    ): void {
        const options: MessageWaitOptions = { channelID, success };

        if (filter) options.filter = filter;
        if (failure) options.failure = failure;

        this.handlers.set(authorID, options);

        if (timeout) {
            setTimeout(() => {
                if (failure && this.handlers.has(authorID)) failure();
                this.handlers.delete(authorID);
            }, timeout * 1000);
        }
    }

    async messageCreate(message: Message) {
        if (message.author.bot) return;
        const options = this.handlers.get(message.author.id);
        if (options == undefined) return;
        if (message.channel.id != options.channelID) return;
        if (options.filter != undefined) {
            if (!(await options.filter(message)) && options.failure) {
                options.failure();
                this.handlers.delete(message.author.id);
                return;
            }
        }

        this.handlers.delete(message.author.id);
        options.success(message);
    }
}

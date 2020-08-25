import { Message } from 'eris';
import UtillyClient from '../../../UtillyClient';

export type MessageWaitFilter = (message: Message) => Promise<boolean>;

export type MessageWaitFailure = () => void;

export type MessageWaitSuccess = (message: Message) => Promise<void>;

export interface MessageWaitOptions {
    channelID: string;
    success: MessageWaitSuccess;
    filter?: MessageWaitFilter;
    failure?: MessageWaitFailure;
}

export class MessageWaitHandler {
    private _bot: UtillyClient;
    private _handlers: Map<string, MessageWaitOptions>;

    constructor(bot: UtillyClient) {
        this._bot = bot;
        this._handlers = new Map();
    }

    attach(): void {
        this._bot.on('messageCreate', this._messageCreate.bind(this));
    }

    addListener(
        channelID: string,
        authorID: string,
        success: MessageWaitSuccess,
        filter?: MessageWaitFilter,
        timeout?: number,
        failure?: MessageWaitFailure
    ): void {
        this._handlers.set(authorID, { channelID, success, filter, failure });

        if (timeout) {
            setTimeout(() => {
                if (failure && this._handlers.has(authorID)) failure();
                this._handlers.delete(authorID);
            }, timeout * 1000);
        }
    }

    private async _messageCreate(message: Message): Promise<void> {
        if (message.author.bot) return;
        const options = this._handlers.get(message.author.id);
        if (options == undefined) return;
        if (message.channel.id != options.channelID) return;
        if (options.filter != undefined) {
            if (!(await options.filter(message)) && options.failure) {
                options.failure();
                this._handlers.delete(message.author.id);
                return;
            }
        }

        this._handlers.delete(message.author.id);
        options.success(message);
    }
}

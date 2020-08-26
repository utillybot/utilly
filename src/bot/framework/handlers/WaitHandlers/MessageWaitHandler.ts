import { Message } from 'eris';
import UtillyClient from '../../../UtillyClient';

export type MessageWaitFilter = (message: Message) => boolean;

export type MessageWaitErrors = 'time' | 'filter';

export interface MessageWaitOptions {
    channelID: string;
    filter: MessageWaitFilter;
    errors: MessageWaitErrors[];
    deleteOtherMessages: boolean;
    resolve: (message: Message) => void;
    reject: () => void;
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
        filter?: MessageWaitFilter,
        timeout?: number,
        errors?: MessageWaitErrors[],
        deleteOtherMessages = true
    ): Promise<Message> {
        if (timeout) {
            setTimeout(() => {
                if (this._handlers.has(authorID)) {
                    this._handlers.get(authorID)?.reject();
                    this._handlers.delete(authorID);
                }
            }, timeout * 1000);
        }

        return new Promise((resolve, reject) => {
            this._handlers.set(authorID, {
                channelID,
                filter: filter ?? (() => true),
                errors: errors || ['time'],
                deleteOtherMessages,
                resolve,
                reject,
            });
        });
    }

    private async _messageCreate(message: Message): Promise<void> {
        if (message.author.bot) return;
        const options = this._handlers.get(message.author.id);
        if (options == undefined) return;
        if (message.channel.id != options.channelID) return;
        if (!options.filter(message)) {
            if (options.errors.includes('filter')) {
                options.reject();
                this._handlers.delete(message.author.id);
                return;
            } else if (options.deleteOtherMessages) {
                message.delete();
                return;
            }
        }

        this._handlers.delete(message.author.id);
        options.resolve(message);
    }
}

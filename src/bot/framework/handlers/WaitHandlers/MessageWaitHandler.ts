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
    timeout?: NodeJS.Timeout;
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

    /**
     *
     * @param channelID  - the channel to listen to messages in
     * @param authorID - the person to listen to messages
     * @param filter - a filter accepting a message and returning a boolean
     * @param timeout - the timeout in seconds until this listener expires
     * @param errors - a list of errors that can cause this handler to reject
     * @param deleteOtherMessages - whether or not all other messages that don't fit the filter should be deleted
     */
    addListener(
        channelID: string,
        authorID: string,
        filter: MessageWaitFilter = () => true,
        timeout = 30,
        errors: MessageWaitErrors[] = ['time'],
        deleteOtherMessages = true
    ): Promise<Message> {
        return new Promise((resolve, reject) => {
            let timeoutID;
            if (errors.includes('time')) {
                timeoutID = setTimeout(() => {
                    const handler = this._handlers.get(authorID);
                    if (!handler) return;
                    handler.reject();
                    this._handlers.delete(authorID);
                }, timeout * 1000);
            }
            this._handlers.set(authorID, {
                channelID,
                filter: filter,
                errors: errors,
                deleteOtherMessages,
                resolve,
                reject,
                timeout: timeoutID,
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
        if (options.timeout) clearTimeout(options.timeout);
    }
}

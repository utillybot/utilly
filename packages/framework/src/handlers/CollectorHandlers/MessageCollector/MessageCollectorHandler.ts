import type { Client, Message } from 'eris';
import type { NextFunction } from '../../Hook';
import { CollectorHandler } from '../CollectorHandler';
import { MessageValidatorHook } from './hooks/MessageValidatorHook';
import type { MessageCollectorHookContext } from './MessageCollectorHook';
import { MessageCollectorHook } from './MessageCollectorHook';

export type MessageWaitFilter = (message: Message) => boolean;

/**
 * A handler for a message collector
 */
export class MessageCollectorHandler extends CollectorHandler<
    MessageCollectorHook,
    MessageCollectorHookContext
> {
    private readonly _bot: Client;

    /**
     * Creates a new reaction collector handler
     * @param bot - the client associated with this collector
     */
    constructor(bot: Client) {
        super();
        this._bot = bot;
    }

    /**
     * Attaches this collector handler to the client to start listening for messages
     */
    attach(): void {
        this._bot.on('messageCreate', this._messageCreate.bind(this));
    }

    /**
     * Old method to add a new listener. Returns a promise that will resolve with the message collected.
     * @param channelId  - the channel to listen to messages in
     * @param authorId - the person to listen to messages
     * @param filter - a filter accepting a message and returning a boolean
     * @param timeout - the timeout in seconds until this listener expires
     */
    async addListener(
        channelId: string,
        authorId: string,
        filter: MessageWaitFilter = () => true,
        timeout = 30
    ): Promise<Message> {
        return new Promise((resolve, reject) => {
            const collector = this.createListener([
                new MessageValidatorHook({
                    channelId,
                    authorId,
                    allowBots: false,
                }),
                new MessageFilterHook({ checkMessage: filter }),
            ]);
            const timer = setTimeout(() => {
                collector.destroy();
                reject();
            }, timeout * 1000);

            collector.on('collect', ctx => {
                collector.destroy();
                resolve(ctx.message);
            });

            collector.on('destroy', () => {
                clearTimeout(timer);
            });
        });
    }

    private async _messageCreate(message: Message): Promise<void> {
        super.checkCollectors({ bot: this._bot, message });
    }
}

/**
 * Settings for the message filter hook
 */
export interface MessageFilterHookSettings {
    /**
     * A function returning whether or not the message should be collected
     * @param message - the message to validate
     */
    checkMessage: (message: Message) => boolean;
}

export interface MessageFilterHook {
    settings: MessageFilterHookSettings;
}

export class MessageFilterHook extends MessageCollectorHook {
    execute(
        ctx: MessageCollectorHookContext,
        next: NextFunction
    ): void | Promise<void> {
        if (this.settings.checkMessage(ctx.message)) {
            next();
        } else {
            ctx.message.delete();
        }
    }
}

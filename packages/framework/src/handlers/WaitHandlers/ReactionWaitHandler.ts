import { Emoji, Member, Message } from 'eris';
import { UtillyClient } from '../../UtillyClient';

export interface ReactionWaitOptions {
    allowedEmotes: string[];
    userID: string;
    resolve: (emote: Emoji) => void;
    reject: () => void;
}

export class ReactionWaitHandler {
    private _bot: UtillyClient;
    private _handlers: Map<string, ReactionWaitOptions>;

    constructor(bot: UtillyClient) {
        this._bot = bot;
        this._handlers = new Map();
    }

    attach(): void {
        this._bot.on('messageReactionAdd', this._messageReactionAdd.bind(this));
    }

    addListener(
        messageID: string,
        userID: string,
        allowedEmotes: string[],
        timeout?: number
    ): Promise<Emoji> {
        if (timeout) {
            setTimeout(() => {
                const message = this._handlers.get(messageID);
                if (!message) return;
                message.reject();
                this._handlers.delete(messageID);
            }, timeout * 1000);
        }
        return new Promise((resolve, reject) => {
            this._handlers.set(messageID, {
                userID,
                allowedEmotes,
                reject,
                resolve,
            });
        });
    }

    private _messageReactionAdd(
        message: Message,
        emoji: Emoji,
        member: Member
    ): void {
        const options = this._handlers.get(message.id);

        if (options == undefined) return;

        if (member.id == this._bot.user.id) return;

        if (
            options.userID != member.id ||
            !options.allowedEmotes.includes(emoji.id)
        ) {
            message.removeReaction(
                `${emoji.name}${emoji.id ? `:${emoji.id}` : ''}`,
                member.id
            );
            return;
        }
        this._handlers.delete(message.id);
        options.resolve(emoji);
    }
}

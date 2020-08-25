import { Emoji, Member, Message } from 'eris';
import UtillyClient from '../../../UtillyClient';
export interface ReactionWaitOptions {
    allowedEmotes: string[];
    userID: string;
    success: ReactionWaitSuccess;
}

export type ReactionWaitFailure = () => void;

export type ReactionWaitSuccess = (emote: Emoji) => Promise<void>;

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
        success: ReactionWaitSuccess,
        failure: ReactionWaitFailure,
        timeout?: number
    ): void {
        this._handlers.set(messageID, { userID, allowedEmotes, success });

        if (timeout) {
            setTimeout(() => {
                if (this._handlers.has(messageID)) {
                    failure();
                    this._handlers.delete(messageID);
                }
            }, timeout * 1000);
        }
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
        options.success(emoji);
    }
}

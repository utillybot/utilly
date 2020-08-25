import { Emoji, Message, Member } from 'eris';
import Logger from '../../../../../core/Logger';
import UtillyClient from '../../../../UtillyClient';
import ReactionWaitOptions from './ReactionWaitOptions';
import ReactionWaitFailure from './ReactionWaitFailure';
import ReactionWaitSuccess from './ReactionWaitSuccess';

export default class ReactionWaitHandler {
    bot: UtillyClient;
    logger: Logger;
    handlers: Map<string, ReactionWaitOptions>;

    constructor(bot: UtillyClient, logger: Logger) {
        this.bot = bot;
        this.logger = logger;
        this.handlers = new Map();
    }

    attach(): void {
        this.bot.on('messageReactionAdd', this.messageReactionAdd.bind(this));
    }

    addListener(
        messageID: string,
        userID: string,
        allowedEmotes: string[],
        success: ReactionWaitSuccess,
        failure: ReactionWaitFailure,
        timeout?: number
    ): void {
        const options: ReactionWaitOptions = {
            userID,
            allowedEmotes,
            success,
        };

        this.handlers.set(messageID, options);

        if (timeout) {
            setTimeout(() => {
                if (this.handlers.has(messageID)) {
                    failure();
                    this.handlers.delete(messageID);
                }
            }, timeout * 1000);
        }
    }

    messageReactionAdd(message: Message, emoji: Emoji, member: Member): void {
        const options = this.handlers.get(message.id);

        if (options == undefined) return;

        if (member.id == this.bot.user.id) return;

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
        this.handlers.delete(message.id);
        options.success(emoji);
    }
}

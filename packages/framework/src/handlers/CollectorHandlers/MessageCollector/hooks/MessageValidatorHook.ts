import type { MessageCollectorHook } from '../MessageCollectorHook';

/**
 * The settings for this message validator hook
 */
export interface MessageValidatorHookSettings {
    /**
     * The channel id to accept messages from
     */
    channelId?: string;

    /**
     * The user id to accept messages from
     */
    authorId?: string;

    /**
     * Whether or not to accept messages from bots
     */
    allowBots?: boolean;
}

/**
 * A hook to validate messages
 */
export const MessageValidatorHook = (
    settings: MessageValidatorHookSettings
): MessageCollectorHook => {
    return (ctx, next): void => {
        if (
            settings.allowBots != undefined &&
            ctx.message.author.bot != settings.allowBots
        )
            return;
        if (settings.channelId && ctx.message.channel.id != settings.channelId)
            return;
        if (settings.authorId && ctx.message.author.id != settings.authorId)
            return;
        next();
    };
};

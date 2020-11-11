import type { ReactionCollectorHook } from './ReactionCollectorHook';

/**
 * The settings for a reaction validator hook
 */
export interface ReactionValidatorHookSettings {
    /**
     * The id to accept reactions from
     */
    messageId?: string;

    /**
     * An array of user ids that can react to this message
     */
    allowedReactorIds?: string[];

    /**
     * An array of emote ids that can be reacted onto the message
     */
    allowedEmoteIds?: string[];

    /**
     * An array of emote names that can be reacted onto the message
     */
    allowedEmoteNames?: string[];

    /**
     * Whether or not to remove reactions that were not in the allowed reactor ids/allowed emote ids
     */
    removeNonValidReactions?: boolean;

    /**
     * Whether or not to ignore the bot user when the bot is adding reactions
     */
    ignoreBot?: boolean;
}

/**
 * A hook to validate reactions
 */
export const ReactionValidatorHook = (
    settings: ReactionValidatorHookSettings
): ReactionCollectorHook => {
    return (ctx, next): void => {
        if (settings.ignoreBot && ctx.bot.users.get(ctx.reactor)?.bot) return;

        if (
            settings.allowedReactorIds &&
            !settings.allowedReactorIds.includes(ctx.reactor)
        ) {
            if (settings.removeNonValidReactions)
                ctx.message.removeReaction(
                    `${ctx.emoji.name}${
                        ctx.emoji.id ? `:${ctx.emoji.id}` : ''
                    }`,
                    ctx.reactor
                );
            return;
        }
        if (
            settings.allowedEmoteIds &&
            !settings.allowedEmoteIds.includes(ctx.emoji.id)
        ) {
            if (settings.removeNonValidReactions)
                ctx.message.removeReaction(
                    `${ctx.emoji.name}${
                        ctx.emoji.id ? `:${ctx.emoji.id}` : ''
                    }`,
                    ctx.reactor
                );
            return;
        }
        if (
            settings.allowedEmoteNames &&
            !settings.allowedEmoteNames.includes(ctx.emoji.name)
        ) {
            if (settings.removeNonValidReactions)
                ctx.message.removeReaction(ctx.emoji.name, ctx.reactor);
            return;
        }

        if (settings.messageId && ctx.message.id != settings.messageId) return;

        next();
    };
};

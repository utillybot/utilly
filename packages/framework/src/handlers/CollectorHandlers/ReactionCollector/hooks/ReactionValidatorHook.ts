import type { ReactionCollectorHookContext } from '../ReactionCollectorHook';
import { ReactionCollectorHook } from '../ReactionCollectorHook';
import type { NextFunction } from '../../../Hook';

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
     * Whether or not to remove reactions that were not in the allowed reactor ids/allowed emote ids
     */
    removeNonValidReactions?: boolean;

    /**
     * Whether or not to ignore the bot user when the bot is adding reactions
     */
    ignoreBot?: boolean;
}

export interface ReactionValidatorHook {
    settings: ReactionValidatorHookSettings;
}

/**
 * A hook to validate reactions
 */
export class ReactionValidatorHook extends ReactionCollectorHook {
    execute(ctx: ReactionCollectorHookContext, next: NextFunction): void {
        if (this.settings.ignoreBot && ctx.bot.users.get(ctx.reactor)?.bot)
            return;

        if (
            this.settings.allowedReactorIds &&
            !this.settings.allowedReactorIds.includes(ctx.reactor)
        ) {
            if (this.settings.removeNonValidReactions)
                ctx.message.removeReaction(
                    `${ctx.emoji.name}${
                        ctx.emoji.id ? `:${ctx.emoji.id}` : ''
                    }`,
                    ctx.reactor
                );
            return;
        }
        if (
            this.settings.allowedEmoteIds &&
            !this.settings.allowedEmoteIds.includes(ctx.emoji.id)
        ) {
            if (this.settings.removeNonValidReactions)
                ctx.message.removeReaction(
                    `${ctx.emoji.name}${
                        ctx.emoji.id ? `:${ctx.emoji.id}` : ''
                    }`,
                    ctx.reactor
                );
            return;
        }

        if (
            this.settings.messageId &&
            ctx.message.id != this.settings.messageId
        )
            return;

        next();
    }
}

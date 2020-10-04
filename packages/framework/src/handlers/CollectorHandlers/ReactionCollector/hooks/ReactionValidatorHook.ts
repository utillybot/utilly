import type { ReactionCollectorHookContext } from '../ReactionCollectorHook';
import { ReactionCollectorHook } from '../ReactionCollectorHook';
import type { NextFunction } from '../../../Hook';

export interface ReactionValidatorHookSettings {
    messageId?: string;

    allowedReactorIds?: string[];
    allowedEmoteIds?: string[];
    removeNonValidReactions?: boolean;

    ignoreBot: boolean;
}

export interface ReactionValidatorHook {
    settings: ReactionValidatorHookSettings;
}

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

import type { NextFunction } from '../../../Hook';
import type { MessageCollectorHookContext } from '../MessageCollectorHook';
import { MessageCollectorHook } from '../MessageCollectorHook';

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

export interface MessageValidatorHook {
    settings: MessageValidatorHookSettings;
}

/**
 * A hook to validate messages
 */
export class MessageValidatorHook extends MessageCollectorHook {
    execute(ctx: MessageCollectorHookContext, next: NextFunction): void {
        if (
            this.settings.allowBots != undefined &&
            ctx.message.author.bot != this.settings.allowBots
        )
            return;
        if (
            this.settings.channelId &&
            ctx.message.channel.id != this.settings.channelId
        )
            return;
        if (
            this.settings.authorId &&
            ctx.message.author.id != this.settings.authorId
        )
            return;
        next();
    }
}

import type { NextFunction } from '../../../Hook';
import type { MessageCollectorHookContext } from '../MessageCollectorHook';
import { MessageCollectorHook } from '../MessageCollectorHook';

export interface MessageValidatorHookSettings {
    channelId?: string;
    authorId?: string;
    allowBots?: boolean;
}

export interface MessageValidatorHook {
    settings: MessageValidatorHookSettings;
}

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

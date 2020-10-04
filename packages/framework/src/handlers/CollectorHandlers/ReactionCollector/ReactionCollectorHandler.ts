import type { Client, Emoji, Member, PossiblyUncachedMessage } from 'eris';
import { Message } from 'eris';
import { CollectorHandler } from '../CollectorHandler';
import type {
    ReactionCollectorHook,
    ReactionCollectorHookContext,
} from './ReactionCollectorHook';
import { MessageValidatorHook } from '../MessageCollector/hooks/MessageValidatorHook';
import { MessageFilterHook } from '../../..';
import { ReactionValidatorHook } from './hooks/ReactionValidatorHook';

export interface ReactionWaitOptions {
    allowedEmotes: string[];
    userID: string;
    resolve: (emote: Emoji) => void;
    reject: () => void;
}

export class ReactionCollectorHandler extends CollectorHandler<
    ReactionCollectorHook,
    ReactionCollectorHookContext
> {
    private readonly _bot: Client;
    private _handlers: Map<string, ReactionWaitOptions>;

    constructor(bot: Client) {
        super();
        this._bot = bot;
        this._handlers = new Map();
    }

    attach(): void {
        this._bot.on('messageReactionAdd', this._messageReactionAdd.bind(this));
    }

    addListener(
        messageId: string,
        userId: string,
        allowedEmoteIds: string[],
        timeout?: number
    ): Promise<Emoji> {
        return new Promise((resolve, reject) => {
            const collector = this.createListener([
                new ReactionValidatorHook({
                    messageId,
                    allowedReactorIds: [userId],
                    allowedEmoteIds,
                    removeNonValidReactions: true,
                    ignoreBot: true,
                }),
            ]);
            let timer: NodeJS.Timeout | undefined;
            if (timeout) {
                timer = setTimeout(() => {
                    collector.destroy();
                    reject();
                }, timeout * 1000);
            }

            collector.on('collect', ctx => {
                collector.destroy();
                resolve(ctx.emoji);
            });

            collector.on('destroy', () => {
                if (timer) clearTimeout(timer);
            });
        });
    }

    private _messageReactionAdd(
        message: PossiblyUncachedMessage,
        emoji: Emoji,
        member: Member | { id: string }
    ): void {
        if (!(message instanceof Message)) return;

        super.checkCollectors({
            bot: this._bot,
            message,
            emoji,
            reactor: member.id,
        });
    }
}

import type { MessageContent } from 'eris';
import { Collector } from '../handlers/CollectorHandlers';
import type {
    ReactionCollectorHook,
    ReactionCollectorHookContext,
} from '../handlers/CollectorHandlers/ReactionCollector';
import { ReactionValidatorHook } from '../handlers/CollectorHandlers/ReactionCollector';
import type { Message } from 'eris';

export class ReactionPaginator extends Collector<
    ReactionCollectorHook,
    ReactionCollectorHookContext
> {
    pages: MessageContent[] = [];
    trackedMessage: Message;
    userId: string;
    currentPage = 0;
    idleTimeout: NodeJS.Timeout;

    constructor(
        message: Message,
        userId: string,
        pages: MessageContent[],
        hooks?: ReactionCollectorHook[]
    ) {
        super(
            hooks
                ? hooks.concat([
                      ReactionValidatorHook({
                          messageId: message.id,
                          allowedReactorIds: [userId],
                          allowedEmoteNames: ['➡️', '⬅️', '⏹️'],
                          removeNonValidReactions: true,
                          ignoreBot: true,
                      }),
                  ])
                : [
                      ReactionValidatorHook({
                          messageId: message.id,
                          allowedReactorIds: [userId],
                          allowedEmoteNames: ['➡️', '⬅️', '⏹️'],
                          removeNonValidReactions: true,
                          ignoreBot: true,
                      }),
                  ]
        );

        this.trackedMessage = message;
        this.userId = userId;
        this.pages = pages;
        this.trackedMessage.addReaction('⬅️');
        this.trackedMessage.addReaction('⏹️');
        this.trackedMessage.addReaction('➡️');
        this.idleTimeout = setTimeout(() => this.end('time'), 30 * 1000);
        this.on('collect', this.onCollect.bind(this));
    }

    async onCollect(ctx: ReactionCollectorHookContext): Promise<void> {
        clearTimeout(this.idleTimeout);
        this.idleTimeout = setTimeout(() => this.end('time'), 30 * 1000);
        switch (ctx.emoji.name) {
            case '➡️': {
                if (++this.currentPage == this.pages.length) {
                    this.currentPage--;
                    break;
                }

                this.trackedMessage = await this.trackedMessage.edit(
                    this.pages[this.currentPage]
                );
                break;
            }
            case '⬅️': {
                if (--this.currentPage == -1) {
                    this.currentPage++;
                    break;
                }

                this.trackedMessage = await this.trackedMessage.edit(
                    this.pages[this.currentPage]
                );
                break;
            }
            case '⏹️': {
                await this.trackedMessage.delete();
                return;
            }
        }
        this.trackedMessage.removeReaction(ctx.emoji.name, this.userId);
    }
}

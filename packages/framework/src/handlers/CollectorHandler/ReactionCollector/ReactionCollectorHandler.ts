import { Client, Emoji, Member, PossiblyUncachedMessage } from 'eris';
import { Message } from 'eris';
import { CollectorHandler } from '../CollectorHandler';
import {
	ReactionCollectorHook,
	ReactionCollectorHookContext,
} from './ReactionCollectorHook';
import { ReactionValidatorHook } from './ReactionValidatorHook';
import { Inject, Service } from '@utilly/di';
import { UtillyClient } from '../../../UtillyClient';
import { CLIENT_TOKEN } from '../../../InjectionTokens';

/**
 * A handler for reaction collector
 */
@Service()
export class ReactionCollectorHandler extends CollectorHandler<
	ReactionCollectorHook,
	ReactionCollectorHookContext
> {
	/**
	 * Creates a new reaction collector handler
	 * @param _bot - the client associated with this collector
	 */
	constructor(@Inject(CLIENT_TOKEN) private readonly _bot: Client) {
		super();
		this._bot.on('messageReactionAdd', this._messageReactionAdd.bind(this));
	}

	/**
	 * Old method to add a new listener. Returns a promise that will resolve with the emoji reacted.
	 * @param messageId - the id of the message to listen for reactions
	 * @param userId - the is of the user to accept reactions from
	 * @param allowedEmoteIds - an array of emote ids that will not be deleted when added
	 * @param timeout - an optional timout to cancel this listener after
	 */
	addListener(
		messageId: string,
		userId: string,
		allowedEmoteIds: string[],
		timeout?: number
	): Promise<Emoji> {
		return new Promise((resolve, reject) => {
			const collector = this.createListener([
				ReactionValidatorHook({
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
					collector.end('time');
					reject();
				}, timeout * 1000);
			}

			collector.on('collect', ctx => {
				collector.end('collected');
				resolve(ctx.emoji);
			});

			collector.on('end', () => {
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

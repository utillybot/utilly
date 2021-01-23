import { Message } from 'eris';
import { CollectorHandler } from '../CollectorHandler';
import { MessageValidatorHook } from './MessageValidatorHook';
import { MessageCollectorHookContext } from './MessageCollectorHook';
import { MessageCollectorHook } from './MessageCollectorHook';
import { Service } from '@utilly/di';
import { UtillyClient } from '../../../UtillyClient';

export type MessageWaitFilter = (message: Message) => boolean;

/**
 * A handler for a message collector
 *
 * @example
 * ```js
 *
 * const listener = new MessageCollectorHandler(bot).createListener(MessageValidatorHook({
 *     channelId: channel.id,
 *     authorId: author.id,
 *     allowBots: false
 * }))
 *
 * const result = await listener.collectNext();
 * const result2 = await listener.coll
 * ```
 */
@Service()
export class MessageCollectorHandler extends CollectorHandler<
	MessageCollectorHook,
	MessageCollectorHookContext
> {
	/**
	 * Creates a new reaction collector handler
	 * @param _bot - the client associated with this collector
	 */
	constructor(private readonly _bot: UtillyClient) {
		super();
		this._bot.bot.on('messageCreate', this._messageCreate.bind(this));
	}

	/**
	 * Old method to add a new listener. Returns a promise that will resolve with the message collected.
	 * @param channelId  - the channel to listen to messages in
	 * @param authorId - the person to listen to messages
	 * @param filter - a filter accepting a message and returning a boolean
	 * @param timeout - the timeout in seconds until this listener expires
	 */
	async addListener(
		channelId: string,
		authorId: string,
		filter: MessageWaitFilter = () => true,
		timeout = 30
	): Promise<Message> {
		return new Promise((resolve, reject) => {
			const collector = this.createListener([
				MessageValidatorHook({
					channelId,
					authorId,
					allowBots: false,
				}),
				MessageFilterHook({ checkMessage: filter }),
			]);
			const timer = setTimeout(() => {
				collector.end('time');
				reject();
			}, timeout * 1000);

			collector.on('collect', ctx => {
				collector.end('collect');
				resolve(ctx.message);
			});

			collector.on('end', () => {
				clearTimeout(timer);
			});
		});
	}

	private async _messageCreate(message: Message): Promise<void> {
		super.checkCollectors({ bot: this._bot.bot, message });
	}
}

/**
 * Settings for the message filter hook
 */
export interface MessageFilterHookSettings {
	/**
	 * A function returning whether or not the message should be collected
	 * @param message - the message to validate
	 */
	checkMessage: (message: Message) => boolean;
}
export const MessageFilterHook = (
	settings: MessageFilterHookSettings
): MessageCollectorHook => {
	return (ctx, next): void => {
		if (settings.checkMessage(ctx.message)) {
			next();
		} else {
			ctx.message.delete();
		}
	};
};

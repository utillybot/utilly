import type { MessageContent } from 'eris';
import type { CommandHook } from '../CommandHook';
import type { PermsValidatorHookSettings } from './PermsValidatorHook';
import { PermsValidatorHook } from './PermsValidatorHook';
import type { Client, Message } from 'eris';

/**
 * Settings for the bot permission validator hook
 */
export interface BotPermValidatorHookSettings
	extends Omit<PermsValidatorHookSettings, 'id'> {
	/**
	 * A function return an error message if the bot is missing permissions
	 * @param missingBotPerms - the permissions the bot is missing
	 */
	errorMessage?: (missingBotPerms: string[]) => MessageContent;

	/**
	 * A function returning the id to check permissions on
	 * @param client - the client user
	 * @param message - the message that invoked this hook
	 */
	id?: (client: Client, message: Message) => string;
}

/**
 * A hook to validate if the bot has certain permissions
 *
 * @param settings - The settings for this hook
 */
export const BotPermsValidatorHook = (
	settings: BotPermValidatorHookSettings
): CommandHook => {
	return (ctx, next): void => {
		const newSettings = Object.assign(
			{
				errorMessage: (missingBotPerms: string[]) =>
					`The bot is missing the following permissions necessary to execute this command: ${missingBotPerms.join(
						', '
					)}`,
				id: (bot: Client) => bot.user.id,
			},
			settings
		);
		PermsValidatorHook(newSettings)(ctx, next);
	};
};

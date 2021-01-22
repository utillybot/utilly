import { CommandHook } from '../CommandHook';
import { MessageContent } from 'eris';

/**
 * Settings for the user id validator hook
 */
export interface UserIdValidatorHookSettings {
	/**
	 * An array of ids that can pass this hook
	 */
	allowedIds: string[];
	/**
	 * An error message to send if the people didn't pass the hook
	 */
	errorMessage?: MessageContent;
}

/**
 * A hook to check if a user is in a certain array of users
 *
 * @param settings - The settings for this hook
 */
export const UserIdValidatorHook = (
	settings: UserIdValidatorHookSettings
): CommandHook => {
	return ({ message }, next): void => {
		if (!settings.errorMessage)
			settings.errorMessage = "You don't have permission to run this command";
		let match = false;

		for (const user of settings.allowedIds) {
			if (message.author.id == user) match = true;
		}

		if (!match && settings.allowedIds.length != 0) {
			message.channel.createMessage(settings.errorMessage);
		} else {
			next();
		}
	};
};

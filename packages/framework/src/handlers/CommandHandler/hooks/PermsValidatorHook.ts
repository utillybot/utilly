import { Client, Constants, GuildChannel, Message, MessageContent } from 'eris';
import { ROLE_PERMISSIONS } from '../../..';
import { CommandHook } from '../CommandHook';

/**
 * Settings for the permission validator hook
 */
export interface PermsValidatorHookSettings {
	/**
	 * A list of permissions to validate
	 */
	permissions: Array<keyof Constants['Permissions']>;
	/**
	 * A function return an error message if the user passed in is missing permissions
	 * @param missingPerms - the permissions the user passed in is missing
	 */
	errorMessage?: (missingPerms: string[]) => MessageContent;
	/**
	 * A function returning the id to check permissions on
	 * @param client - the client user
	 * @param message - the message that invoked this hook
	 */
	id: (client: Client, message: Message) => string;
}

/**
 * A hook to check if a given user contains the permissions passed in
 *
 * @param settings- The settings for this hook
 */
export const PermsValidatorHook = (
	settings: PermsValidatorHookSettings
): CommandHook => {
	return ({ bot, message }, next): void => {
		const id = settings.id(bot, message);

		if (!settings.errorMessage)
			settings.errorMessage = (missingPerms: string[]) =>
				`Uh oh, ${
					bot.users.get(id)?.username
				} is missing these permissions ${missingPerms.join(', ')}`;

		const missingPerms = [];
		if (!(message.channel instanceof GuildChannel)) return;
		for (const permission of settings.permissions) {
			if (!message.channel.permissionsOf(id).has(permission)) {
				const item = ROLE_PERMISSIONS.get(Constants.Permissions[permission]);
				if (item) missingPerms.push(item);
			}
		}

		if (missingPerms.length > 0) {
			message.channel.createMessage(settings.errorMessage(missingPerms));
		} else {
			next();
		}
	};
};

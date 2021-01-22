import { CommandHook, isGuildChannel } from '@utilly/framework';
import { Database, GuildRepository } from '@utilly/database';
import { GlobalStore } from '@utilly/di';

/**
 * Settings for the is module enabled hook
 */
export interface IsModuleEnabledHookSettings {
	/**
	 * The entry in the database
	 */
	databaseEntry: string;
}

/**
 * A hook to check if a database module is enabled
 *
 * @param settings - the settings for this hook
 */
export const IsModuleEnabledHook = (
	settings: IsModuleEnabledHookSettings
): CommandHook => {
	return async ({ message }, next): Promise<void> => {
		if (isGuildChannel(message.channel)) {
			const guildRow = await GlobalStore.resolve(Database)
				.connection.getCustomRepository(GuildRepository)
				.selectOrCreate(message.channel.guild.id, [settings.databaseEntry]);
			const enabled = guildRow[settings.databaseEntry];
			if (enabled == true) {
				next();
			}
		}
	};
};

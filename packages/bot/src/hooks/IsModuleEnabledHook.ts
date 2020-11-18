import type { CommandHook } from '@utilly/framework';
import { GuildChannel } from 'eris';
import { GuildRepository } from '@utilly/database';
import { isGuildChannel } from '@utilly/framework';

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
	return async ({ bot, message }, next): Promise<void> => {
		if (isGuildChannel(message.channel)) {
			const guildRow = await bot.database.connection
				.getCustomRepository(GuildRepository)
				.selectOrCreate(message.channel.guild.id, [settings.databaseEntry]);
			const enabled = guildRow[settings.databaseEntry];
			if (enabled == true) {
				next();
			}
		}
	};
};

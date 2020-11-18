import type { Guild } from '@utilly/database';
import { GuildRepository } from '@utilly/database';
import type { EmbedBuilder } from '@utilly/framework';
import { isTextChannel, Module } from '@utilly/framework';
import type { Webhook } from 'eris';
import type Eris from 'eris';
import { EMOTE_CONSTANTS } from '../../constants/EmoteConstants';

/**
 * Base Logging Module
 */
export default class LoggingModule extends Module {
	/**
	 * Selects a guild row for a specific guild with a few columns selected
	 * @param guildID - the guild id
	 * @param type - the type of the event
	 */
	async selectGuildRow(guildID: string, type: string): Promise<Guild> {
		return await this.bot.database.connection
			.getCustomRepository(GuildRepository)
			.selectOrCreate(guildID, [
				'logging',
				`logging_${type}Channel`,
				`logging_${type}Event`,
			]);
	}

	/**
	 * Gets the log channel for a specific event in a guild
	 * @param guild - the guild to get the channel from
	 * @param logChannelID - the id of the channel
	 */
	getLogChannel(
		guild: Eris.Guild,
		logChannelID: string | null
	): Eris.TextChannel | null {
		if (logChannelID == null) return null;

		const logChannel = guild.channels.get(logChannelID);

		if (logChannel != null && isTextChannel(logChannel)) {
			return logChannel;
		} else {
			return null;
		}
	}

	getEmotes(
		channel: Eris.GuildChannel
	): { check: string; xmark: string; empty: string } {
		let check = EMOTE_CONSTANTS.fallbackcheck;
		let xmark = EMOTE_CONSTANTS.fallbackxmark;
		let empty = EMOTE_CONSTANTS.fallbackempty;

		let notice = false;

		const everyoneOverwrites = channel.permissionOverwrites.get(
			channel.guild.id
		);

		// If the @everyone overwrite doesn't exist or it doesn't allow or deny use external emojis
		if (
			!everyoneOverwrites ||
			(!(everyoneOverwrites.allow & 0x00040000) &&
				!(everyoneOverwrites.deny & 0x00040000))
		) {
			const everyoneRole = channel.guild.roles.get(channel.guild.id);
			if (!everyoneRole) return { check, xmark, empty };

			// If the @everyone role doesn't allow external emojis, use the fallback
			if (!(everyoneRole.permissions.allow & 0x00040000)) notice = true;
		} else if (everyoneOverwrites && everyoneOverwrites.deny & 0x00040000) {
			// If the @everyone overwrite exists and denies external emojis, use the fallback
			notice = true;
		}

		if (!notice) {
			check = EMOTE_CONSTANTS.check;
			xmark = EMOTE_CONSTANTS.xmark;
			empty = EMOTE_CONSTANTS.empty;
		}

		return { check, xmark, empty };
	}

	async sendLogMessage(
		logChannel: Eris.TextChannel,
		content: EmbedBuilder
	): Promise<void> {
		const webhooks: Webhook[] = await logChannel.getWebhooks();

		for (const webhook of webhooks) {
			if (webhook.name == 'Utilly Logging') {
				this.bot.executeWebhook(webhook.id, webhook.token, {
					avatarURL: this.bot.user.avatarURL,
					embeds: [content],
				});
				return;
			}
		}
		try {
			const webhook = await logChannel.createWebhook({
				name: 'Utilly Logging',
				avatar:
					'data:image/png;base64,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',
			});

			this.bot.executeWebhook(webhook.id, webhook.token, {
				avatarURL: this.bot.user.avatarURL,
				embeds: [content],
			});
		} catch {
			logChannel.createMessage({ embed: content });
		}
	}
}

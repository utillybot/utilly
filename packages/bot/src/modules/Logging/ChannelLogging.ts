import {
	AttachableModule,
	CHANNEL_PERMISSIONS,
	EmbedBuilder,
	isCategoryChannel,
	isGuildChannel,
	isTextChannel,
	isVoiceChannel,
} from '@utilly/framework';
import { secondsToString } from '@utilly/utils';
import {
	AnyChannel,
	Client,
	Guild,
	GuildChannel,
	OldGroupChannel,
	OldGuildChannel,
	TextChannel,
} from 'eris';
import LoggingModule from './LoggingModule';
import { Service } from '@utilly/di';

interface ChangedData {
	name: string;
	old: string;
	new: string;
}

/* eslint-disable no-prototype-builtins */

/**
 * Logging Module for Server Events
 */
@Service()
export default class ChannelLogging extends AttachableModule {
	constructor(private _parent: LoggingModule) {
		super();
	}

	attach(bot: Client): void {
		bot.on('channelCreate', this._channelCreate.bind(this));
		bot.on('channelDelete', this._channelDelete.bind(this));
		bot.on('channelUpdate', this._channelUpdate.bind(this));
	}

	/**
	 * Adds a timestamp for partial builds and a guild info and guild id for full builds
	 * @param embed - the embed builder
	 * @param guild - the guild this belongs to.
	 */
	private _buildEmbed(embed: EmbedBuilder, guild: Guild): EmbedBuilder {
		embed.setTimestamp();
		embed.setAuthor(guild.name, undefined, guild.iconURL ?? undefined);

		return embed;
	}

	/**
	 * Handles the event where a channel is updated
	 * @param newChannel - the new channel
	 * @param oldCh - the old channel
	 */
	private async _channelUpdate(
		newChannel: AnyChannel,
		oldCh: OldGuildChannel | OldGroupChannel
	): Promise<void> {
		if (!isGuildChannel(newChannel)) return;
		const oldChannel = oldCh as OldGuildChannel;

		//#region prep
		const guildRow = await this._parent.selectGuildRow(
			newChannel.guild.id,
			'channelUpdate'
		);

		if (!guildRow.logging || !guildRow.logging_channelUpdateEvent) return;

		const logChannel: TextChannel | null = this._parent.getLogChannel(
			newChannel.guild,
			guildRow.logging_channelUpdateChannel
		);
		if (logChannel == null) return;

		const { check, xmark, empty } = this._parent.getEmotes(logChannel);

		//#endregion

		//#region embed header
		let embed = new EmbedBuilder();

		const overviewData: ChangedData[] = [];
		if (newChannel.name != oldChannel.name)
			overviewData.push({
				name: 'Name',
				old: oldChannel.name,
				new: newChannel.mention,
			});

		//Prepare Embed Header and Overview changes
		if (isTextChannel(newChannel)) {
			embed.setTitle('Text Channel Updated');
			embed.setDescription(`Channel: <#${newChannel.id}>`);

			if (newChannel.topic != oldChannel.topic)
				overviewData.push({
					name: 'Topic',
					old:
						oldChannel.topic != '' && oldChannel.topic != null
							? oldChannel.topic
							: '(cleared)',
					new:
						newChannel.topic != '' && newChannel.topic != null
							? newChannel.topic
							: '(cleared)',
				});

			if (newChannel.rateLimitPerUser != oldChannel.rateLimitPerUser)
				overviewData.push({
					name: 'Slowmode',
					old:
						oldChannel.rateLimitPerUser == 0 ||
						oldChannel.rateLimitPerUser == undefined
							? 'Off'
							: secondsToString(oldChannel.rateLimitPerUser),
					new:
						newChannel.rateLimitPerUser == 0
							? 'Off'
							: secondsToString(newChannel.rateLimitPerUser),
				});

			if (newChannel.nsfw != oldChannel.nsfw)
				overviewData.push({
					name: 'NSFW',
					old: oldChannel.nsfw ? check : xmark,
					new: newChannel.nsfw ? check : xmark,
				});

			if (newChannel.parentID != oldChannel.parentID)
				overviewData.push({
					name: 'Category',
					old:
						(oldChannel.parentID &&
							newChannel.guild.channels.get(oldChannel.parentID)?.name) ??
						'(none)',
					new:
						(newChannel.parentID &&
							newChannel.guild.channels.get(newChannel.parentID)?.name) ??
						'(none)',
				});

			if (overviewData.length > 0)
				embed.addField(
					'Overview',
					overviewData
						.map(item => `**${item.name}**: ${item.old} ➜ ${item.new}`)
						.join('\n')
				);
		} else if (isVoiceChannel(newChannel)) {
			embed.setTitle('Voice Channel Updated');
			embed.setDescription(`Channel: ${newChannel.name}`);

			if (
				newChannel.bitrate != oldChannel.bitrate &&
				oldChannel.bitrate &&
				newChannel.bitrate
			)
				overviewData.push({
					name: 'Bitrate',
					old: `${oldChannel.bitrate / 1000}kbps`,
					new: `${newChannel.bitrate / 1000}kbps`,
				});

			if (newChannel.userLimit != oldChannel.userLimit)
				overviewData.push({
					name: 'User Limit',
					old:
						oldChannel.userLimit == 0
							? 'No Limit'
							: `${oldChannel.userLimit} users`,
					new:
						newChannel.userLimit == 0
							? 'No Limit'
							: `${newChannel.userLimit} users`,
				});

			if (newChannel.parentID != oldChannel.parentID)
				overviewData.push({
					name: 'Category',
					old:
						(oldChannel.parentID &&
							newChannel.guild.channels.get(oldChannel.parentID)?.name) ??
						'(none)',
					new:
						(newChannel.parentID &&
							newChannel.guild.channels.get(newChannel.parentID)?.name) ??
						'(none)',
				});

			if (overviewData.length > 0)
				embed.addField(
					'Overview',
					overviewData
						.map(item => `**${item.name}**: ${item.old} ➜ ${item.new}`)
						.join('\n')
				);
		} else if (isCategoryChannel(newChannel)) {
			embed.setTitle('Category Updated');
			embed.setDescription(`**Name**: ${newChannel.name}}`);
		} else {
			embed.setTitle('Channel Updated');
			embed.setDescription(`**Name**: ${newChannel.name}`);
		}
		embed.setFooter(`Channel ID: ${newChannel.id}`);
		//#endregion

		//#region permissions
		// Prepare permission changes
		const permissions: Map<string | number, string> = new Map();
		// Loop over old permission overwrites
		for (const [entity, oldOverwrite] of oldChannel.permissionOverwrites) {
			// Get the new permission overwrite equivalent, if possible
			const newOverwrite = newChannel.permissionOverwrites.get(entity);
			let header = '';

			// If the overwrites are the same, there is no need to record changes
			if (oldOverwrite != null && newOverwrite != null) {
				if (
					newOverwrite.allow == oldOverwrite.allow &&
					newOverwrite.deny == oldOverwrite.deny &&
					oldOverwrite.id == newOverwrite.id
				)
					continue;
			}

			// If the permissions map doesn't have this overwrite, add the header
			if (!permissions.has(entity)) {
				if (oldOverwrite.type == 'role') {
					if (entity == newChannel.guild.id) {
						permissions.set(entity, '\n**Role @everyone**\n');
						header = '\n**Role @everyone**\n';
					} else {
						permissions.set(entity, `\n**Role <@&${entity}>**\n`);
						header = `\n**Role <@&${entity}>**\n`;
					}
				}
				if (oldOverwrite.type == 'member') {
					permissions.set(entity, `\n**Member <@${entity}>**\n`);
					header = `\n**Member <@${entity}>**\n`;
				}
			}

			// Loop through the old channel's permission overwrites
			for (const [permissionBit, permission] of CHANNEL_PERMISSIONS) {
				// Prepare to add to the text
				let changedText = permissions.get(entity);
				// The permission is allowed in the old overwrite
				if (oldOverwrite.allow & permissionBit) {
					// The permission is not allowed or denied in the new overwrite
					// So, it has been cleared
					if (
						newOverwrite == null ||
						(!(newOverwrite.allow & permissionBit) &&
							!(newOverwrite.deny & permissionBit))
					) {
						changedText += `${permission}: ${check} ➜ ${empty}\n`;
						// The new overwrite denies the permission
					} else if (newOverwrite.deny & permissionBit) {
						changedText += `${permission}: ${check} ➜ ${xmark}\n`;
					}
					// The permission is denied in the old overwrite
				} else if (oldOverwrite.deny & permissionBit) {
					// The permission is not allowed or denied in the new overwrite
					// So, it has been cleared
					if (
						newOverwrite == null ||
						(!(newOverwrite.allow & permissionBit) &&
							!(newOverwrite.deny & permissionBit))
					) {
						changedText += `${permission}: ${xmark} ➜ ${empty}\n`;
						// The new overwrite allows the permission
					} else if (newOverwrite.allow & permissionBit) {
						changedText += `${permission}: ${xmark} ➜ ${check}\n`;
					}
				} else if (newOverwrite != null) {
					if (newOverwrite.allow & permissionBit) {
						changedText += `${permission}: ${empty} ➜ ${check}\n`;
					} else if (newOverwrite.deny & permissionBit) {
						changedText += `${permission}: ${empty} ➜ ${xmark}\n`;
					}
				}
				if (changedText != undefined) permissions.set(entity, changedText);
			}
			if (permissions.get(entity) == header) {
				let changedText = permissions.get(entity);
				changedText += '**Overwrite deleted**';
				if (changedText != undefined) permissions.set(entity, changedText);
			}
		}

		const createdOverwrites = newChannel.permissionOverwrites.filter(
			overwrite =>
				!Array.from(oldChannel.permissionOverwrites.keys()).includes(
					overwrite.id
				)
		);
		for (const overwrite of createdOverwrites) {
			const entity = overwrite.id;
			// If the permissions map doesn't have this overwrite, add the header
			let header = '';
			if (!permissions.has(entity)) {
				if (overwrite.type == 'role') {
					if (entity == newChannel.guild.id) {
						permissions.set(entity, '\n**Role @everyone**\n');
						header = '\n**Role @everyone**\n';
					} else {
						permissions.set(entity, `\n**Role <@&${entity}>**\n`);
						header = `\n**Role <@&${entity}>**\n`;
					}
				}
				if (overwrite.type == 'member') {
					permissions.set(entity, `\n**Member <@${entity}>**\n`);
					header = `\n**Member <@${entity}>**\n`;
				}
			}

			for (const [permissionBit, permission] of CHANNEL_PERMISSIONS) {
				let changedText = permissions.get(entity);

				if (overwrite.allow & permissionBit) {
					changedText += `${permission}: ${empty} ➜ ${check}\n`;
				} else if (overwrite.deny & permissionBit) {
					changedText += `${permission}: ${empty} ➜ ${xmark}\n`;
				}
				if (changedText != undefined) permissions.set(entity, changedText);
			}

			if (permissions.get(entity) == header) {
				let changedText = permissions.get(entity);
				changedText += '**Overwrite created**';
				if (changedText != undefined) permissions.set(entity, changedText);
			}
		}

		// If any permission has been updated, the map size will be greater than 0
		if (permissions.size > 0) {
			// Prepare to have multiple pages of permissions
			const embedPages = [''];
			let current = 0;

			// Loop through the permissions map
			for (const [, value] of permissions) {
				// If current page's length plus the next overwrite's length is greater than 1024 (embed field maximum)
				// increase the page number
				if (embedPages[current].length + value.length > 1024) {
					current++;
				}
				// If the current page is null, add the page in
				if (embedPages[current] == null) {
					embedPages.push('');
				}
				// Add the permission overwrite data to the current page
				embedPages[current] += value;
			}

			// If there is only 1 page, add that page to the embed
			if (embedPages.length == 1) {
				embed.addField('Permission Overwrites', embedPages[0], true);
				// Otherwise, loop through the pages and add each one to the embed
			} else {
				for (let i = 0; i < embedPages.length; i++) {
					embed.addField(`Permission Overwrites ${i + 1}`, embedPages[i], true);
				}
			}
		}

		//#endregion

		// Final additions and send message
		embed = this._buildEmbed(embed, newChannel.guild);
		this._parent.sendLogMessage(logChannel, embed);
	}

	/**
	 * Handles the event where a channel is deleted
	 * @param channel - the deleted channel
	 */
	private async _channelDelete(channel: AnyChannel): Promise<void> {
		if (!isGuildChannel(channel)) return;

		//#region prep
		const guildRow = await this._parent.selectGuildRow(
			channel.guild.id,
			'channelDelete'
		);

		if (!guildRow.logging || !guildRow.logging_channelDeleteEvent) return;

		const logChannel: TextChannel | null = this._parent.getLogChannel(
			channel.guild,
			guildRow.logging_channelDeleteChannel
		);
		if (logChannel == null) return;
		//#endregion

		this._channelCD(
			channel,
			logChannel,
			'Deleted',
			this._parent.getEmotes(logChannel)
		);
	}

	/**
	 * Handles the event where a channel is created
	 * @param channel - the created channel
	 */
	private async _channelCreate(channel: AnyChannel): Promise<void> {
		if (!isGuildChannel(channel)) return;

		//#region prep
		const guildRow = await this._parent.selectGuildRow(
			channel.guild.id,
			'channelCreate'
		);

		if (!guildRow.logging || !guildRow.logging_channelCreateEvent) return;

		const logChannel: TextChannel | null = this._parent.getLogChannel(
			channel.guild,
			guildRow.logging_channelCreateChannel
		);
		if (logChannel == null) return;

		//#endregion

		this._channelCD(
			channel,
			logChannel,
			'Created',
			this._parent.getEmotes(logChannel)
		);
	}

	private async _channelCD(
		channel: GuildChannel,
		logChannel: TextChannel,
		request: string,
		emotes: { check: string; xmark: string; empty: string }
	): Promise<void> {
		const { check, xmark } = emotes;

		//#region embed header
		// Prepare embed
		let embed = new EmbedBuilder();
		let info = '';

		info += `**Name**: ${channel.name}\n`;
		// Add embed header and info
		if (isTextChannel(channel)) {
			embed.setTitle(`Text Channel ${request}`);
			embed.setDescription(
				`Channel: ${
					request == 'Created' ? `<#${channel.id}>` : channel.name
				}\nChannel ID: ${channel.id}`
			);
			info += `**Topic**: ${
				channel.topic != '' && channel.topic != null
					? channel.topic
					: '(cleared)'
			}\n`;

			info += `**Slowmode**: ${
				channel.rateLimitPerUser != 0
					? secondsToString(channel.rateLimitPerUser)
					: 'Off'
			}\n`;

			info += `**NSFW**: ${channel.nsfw ? check : xmark}\n`;

			if (channel.parentID) {
				info += `**Category**: ${
					channel.guild.channels.get(channel.parentID)?.name
				}`;
			}

			if (info != '') embed.addField('Info', info);
		} else if (isVoiceChannel(channel)) {
			embed.setTitle(`Voice Channel ${request}`);
			embed.setDescription(`Channel: ${channel.name}`);
			if (channel.bitrate)
				info += `**Bitrate**: ${channel.bitrate / 1000}kbps\n`;

			info += `**User Limit**: ${
				channel.userLimit == 0 || channel.userLimit == undefined
					? 'No Limit'
					: `${channel.userLimit} users`
			}\n`;

			if (channel.parentID) {
				info += `**Category**: ${
					channel.guild.channels.get(channel.parentID)?.name
				}`;
			}

			if (info != '') embed.addField('Info', info);
		} else if (isCategoryChannel(channel)) {
			embed.setTitle(`Category ${request}`);
			embed.setDescription(`**Name**: ${channel.name}`);
			if (info != '') embed.addField('Info', info);
		} else {
			embed.setTitle(`Channel ${request}`);
			embed.setDescription(`**Name**: ${channel.name}`);
			if (channel.parentID) {
				info += `**Category**: ${
					channel.guild.channels.get(channel.parentID)?.name
				}`;
			}

			if (info != '') embed.addField('Info', info);
		}
		embed.setFooter(`Channel ID: ${channel.id}`);

		//#endregion

		//#region permissions
		// Setup permission map
		const permissions: Map<string | number, string> = new Map();
		// Loop through the permission overwrites
		for (const [entity, overwrite] of channel.permissionOverwrites) {
			// If the permission map doesn't have the overwrites, add the header
			if (!permissions.has(entity)) {
				if (overwrite.type == 'role') {
					if (entity == channel.guild.id) {
						permissions.set(entity, '\n**Role @everyone\n**');
					} else {
						permissions.set(entity, `\n**Role <@&${entity}>\n**`);
					}
				} else if (overwrite.type == 'member') {
					permissions.set(entity, `\n**Member <@${entity}>\n**`);
				}
			}

			// Loop through the permissions and add a check or x depending on if the permission is allowed or denied
			for (const [permissionBit, permission] of CHANNEL_PERMISSIONS) {
				let changedText = permissions.get(entity);
				if (overwrite.allow & permissionBit) {
					changedText += `${permission}: ${check}\n`;
				} else if (overwrite.deny & permissionBit) {
					changedText += `${permission}: ${xmark}\n`;
				}
				if (changedText != null) permissions.set(entity, changedText);
			}
		}

		// If any permission has been updated, the map size will be greater than 0
		if (permissions.size > 0) {
			// Prepare to have multiple pages of permissions
			const embedPages = [''];
			let current = 0;

			// Loop through the permissions map
			for (const [, value] of permissions) {
				// If current page's length plus the next overwrite's length is greater than 1024 (embed field maximum)
				// increase the page number
				if (embedPages[current].length + value.length > 1024) {
					current++;
				}
				// If the current page is null, add the page in
				if (embedPages[current] == null) {
					embedPages.push('');
				}
				// Add the permission overwrite data to the current page
				embedPages[current] += value;
			}

			// If there is only 1 page, add that page to the embed
			if (embedPages.length == 1) {
				embed.addField('Permission Overwrites', embedPages[0], true);
				// Otherwise, loop through the pages and add each one to the embed
			} else {
				for (let i = 0; i < embedPages.length; i++) {
					embed.addField(`Permission Overwrites ${i + 1}`, embedPages[i], true);
				}
			}
		}
		//#endregion

		// Final additions and send
		embed = this._buildEmbed(embed, channel.guild);
		this._parent.sendLogMessage(logChannel, embed);
	}
}

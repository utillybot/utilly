import {
	AttachableModule,
	EmbedBuilder,
	isCachedMessage,
	isGuildChannel,
	isTextChannel,
} from '@utilly/framework';
import type {
	Attachment,
	Embed,
	Guild,
	OldMessage,
	PossiblyUncachedMessage,
	TextChannel,
} from 'eris';
import type { Message } from 'eris';
import type LoggingModule from './LoggingModule';

/**
 * Logging Module for Messages
 */
export default class MessageLogging extends AttachableModule {
	parentModule!: LoggingModule;

	attach(): void {
		this.bot.on('messageDelete', this._messageDelete.bind(this));
		this.bot.on('messageUpdate', this._messageUpdate.bind(this));
		this.bot.on('messageDeleteBulk', this._messageDeleteBulk.bind(this));
	}

	/**
	 * Adds a message id, author info, and a timestamp to an embed
	 * @param embed - the embed builder
	 * @param message - the message
	 */
	private _buildEmbed(embed: EmbedBuilder, message: Message): EmbedBuilder {
		embed.setAuthor(
			`${message.author.username}#${message.author.discriminator}`,
			undefined,
			message.author.avatarURL
		);
		embed.setFooter(`Message ID: ${message.id}`);
		embed.setTimestamp();

		return embed;
	}

	/**
	 * Adds a field to the end of the embed specifying any other notes about the message
	 * @param embed - the embed builder
	 * @param message - the message
	 */
	private _addOtherField(
		embed: EmbedBuilder,
		message: {
			attachments: Attachment[];
			embeds: Embed[];
			pinned: boolean;
			tts: boolean;
			webhookID?: string;
		}
	): EmbedBuilder {
		let otherNotes = '';
		if (message.attachments == null) return embed;
		if (message.attachments.length > 0) {
			otherNotes += `- This message had ${message.attachments.length} attachment(s)\n`;
			for (let i = 0; i < message.attachments.length; i++) {
				const attachment = message.attachments[i];
				otherNotes += `- [Attachment #${i + 1}](${attachment.url})\n`;
			}
		}
		if (message.embeds.length > 0) {
			otherNotes += `- This message had ${message.embeds.length} embed(s)\n`;
		}
		if (message.pinned) {
			otherNotes += '- This message was pinned\n';
		}
		if (message.tts) {
			otherNotes += '- This message was TTS\n';
		}
		if (message.webhookID) {
			otherNotes += `- This message was sent by webhook ${message.webhookID}`;
		}
		if (otherNotes != '') {
			embed.addField('Message Info', otherNotes);
		}
		return embed;
	}

	/**
	 * Handles the event where multiple messages are bulk deleted
	 * @param messages - the messages deleted
	 */
	private async _messageDeleteBulk(
		messages: PossiblyUncachedMessage[]
	): Promise<void> {
		let cachedMessage: Message | undefined = undefined;
		let guild: Guild | undefined = undefined;

		for (const message of messages) {
			if (!isCachedMessage(message)) continue;
			if (!isTextChannel(message.channel)) continue;
			cachedMessage = message;
			guild = message.channel.guild;
			break;
		}

		if (cachedMessage == undefined) return;
		if (guild == undefined) return;

		const guildRow = await this.parentModule.selectGuildRow(
			guild.id,
			'messageDeleteBulk'
		);

		if (!guildRow.logging || !guildRow.logging_messageDeleteBulkEvent) return;

		const logChannel: TextChannel | null = this.parentModule.getLogChannel(
			guild,
			guildRow.logging_messageDeleteBulkChannel
		);
		if (logChannel == null) return;

		const embed: EmbedBuilder = new EmbedBuilder();
		embed.setColor(0xff0000);
		embed.setTitle(`${messages.length} Messages Bulk Deleted (Purged)`);
		embed.setDescription(`In channel <#${messages[0].channel.id}>`);
		embed.setTimestamp();

		await this.parentModule.sendLogMessage(logChannel, embed);
	}

	/**
	 * Handles the event where one message is deleted
	 * @param message - the message deleted
	 */
	private async _messageDelete(
		message: PossiblyUncachedMessage
	): Promise<void> {
		if (!isCachedMessage(message)) return;
		if (!isGuildChannel(message.channel)) return;

		const guildRow = await this.parentModule.selectGuildRow(
			message.channel.guild.id,
			'messageDelete'
		);

		if (!guildRow.logging || !guildRow.logging_messageDeleteEvent) return;

		const logChannel: TextChannel | null = this.parentModule.getLogChannel(
			message.channel.guild,
			guildRow.logging_messageDeleteChannel
		);
		if (logChannel == null) return;

		let embed: EmbedBuilder = new EmbedBuilder();
		embed.setColor(0xff0000);
		embed.setTitle('Deleted Message');
		embed.setDescription(`In channel <#${message.channel.id}>`);

		if (message.content || message.content != '') {
			embed.addField('Message Content', message.content, true);
		}

		embed = this._buildEmbed(embed, message);
		embed = this._addOtherField(embed, message);
		await this.parentModule.sendLogMessage(logChannel, embed);
	}

	/**
	 * Handles the event where a message is edited
	 * @param message - the new message
	 * @param oldMessage - the old message
	 */
	private async _messageUpdate(
		message: Message,
		oldMessage: OldMessage | null
	): Promise<void> {
		if (!isGuildChannel(message.channel)) return;
		if (oldMessage && oldMessage.content == message.content) return;
		const guildRow = await this.parentModule.selectGuildRow(
			message.channel.guild.id,
			'messageUpdate'
		);

		if (!guildRow.logging || !guildRow.logging_messageUpdateEvent) return;

		const logChannel: TextChannel | null = this.parentModule.getLogChannel(
			message.channel.guild,
			guildRow.logging_messageUpdateChannel
		);
		if (logChannel == null) return;

		let embed: EmbedBuilder = new EmbedBuilder();
		embed.setColor(0x00ff00);
		embed.setTitle('Message Edited');
		embed.setDescription(`In channel <#${message.channel.id}>`);

		if (oldMessage && oldMessage.content != '') {
			embed.addField('Previous Message', oldMessage.content, true);
		}
		if (message.content != '') {
			embed.addField('New Message', message.content, true);
		}

		embed = this._buildEmbed(embed, message);
		if (oldMessage) embed = this._addOtherField(embed, oldMessage);
		await this.parentModule.sendLogMessage(logChannel, embed);
	}
}

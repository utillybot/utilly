import { Message, TextChannel } from 'eris';
import AttachableModule from '../../handlers/ModuleHandler/Submodule/AttachableModule';
import EmbedBuilder from '../../helpers/Embed';
import LoggingModule from './LoggingModule';

/**
 * Logging Module for Messages
 */
export default class MessageLogging extends AttachableModule {
    parentModule!: LoggingModule;

    attach(): void {
        this.bot.on('messageDelete', this.messageDelete.bind(this));
        this.bot.on('messageUpdate', this.messageUpdate.bind(this));
        this.bot.on('messageDeleteBulk', this.messageDeleteBulk.bind(this));
    }

    /**
     * Adds a message id, author info, and a timestamp to an embed
     * @param embed - the embed builder
     * @param message - the message
     */
    private buildEmbed(embed: EmbedBuilder, message: Message): EmbedBuilder {
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
    private addOtherField(embed: EmbedBuilder, message: Message): EmbedBuilder {
        let otherNotes = '';
        if (message.attachments == null) return embed;
        if (message.attachments.length > 0) {
            otherNotes += `- This message had ${message.attachments.length} attachment(s)\n`;
        }
        if (message.embeds.length > 0) {
            otherNotes += `- This message had ${message.embeds.length} embed(s)\n`;
        }
        if (message.pinned == true) {
            otherNotes += '- This message was pinned\n';
        }
        if (message.tts == true) {
            otherNotes += '- This message was TTS\n';
        }
        if (message.webhookID != null) {
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
    private async messageDeleteBulk(
        messages: Message<TextChannel>[]
    ): Promise<void> {
        const guildRow = await this.parentModule.selectGuildRow(
            messages[0].channel.guild,
            'messageDeleteBulk'
        );

        if (!guildRow.logging || !guildRow.logging_messageDeleteBulkEvent)
            return;

        const logChannel: TextChannel | null = this.parentModule.getLogChannel(
            messages[0].channel.guild,
            guildRow.logging_messageDeleteBulkChannel
        );
        if (logChannel == null) return;

        const embed: EmbedBuilder = new EmbedBuilder();
        embed.setColor(0xff0000);
        embed.setTitle(`${messages.length} Messages Bulk Deleted (Purged)`);
        embed.setDescription(`In channel <#${messages[0].channel.id}>`);
        embed.setTimestamp();

        logChannel.createMessage({ embed });
    }

    /**
     * Handles the event where one message is deleted
     * @param message - the message deleted
     */
    private async messageDelete(message: Message<TextChannel>): Promise<void> {
        const guildRow = await this.parentModule.selectGuildRow(
            message.channel.guild,
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

        if (message.content != '' && message.content != null) {
            embed.addField('Message Content', message.content, true);
        }

        embed = this.buildEmbed(embed, message);
        embed = this.addOtherField(embed, message);
        logChannel.createMessage({ embed });
    }

    /**
     * Handles the event where a message is edited
     * @param message - the new message
     * @param oldMessage - the old message
     */
    private async messageUpdate(
        message: Message<TextChannel>,
        oldMessage: Message<TextChannel>
    ): Promise<void> {
        if (oldMessage == null) return;
        if (oldMessage.content == message.content) return;
        const guildRow = await this.parentModule.selectGuildRow(
            message.channel.guild,
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

        if (oldMessage.content != '') {
            embed.addField('Previous Message', oldMessage.content, true);
        }
        if (message.content != '') {
            embed.addField('New Message', message.content, true);
        }

        embed = this.buildEmbed(embed, message);
        embed = this.addOtherField(embed, oldMessage);
        logChannel.createMessage({ embed });
    }
}

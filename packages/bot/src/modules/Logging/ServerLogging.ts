import { AttachableModule, EmbedBuilder } from '@utilly/framework';
import type LoggingModule from './LoggingModule';
import type { Guild, OldGuild, TextChannel } from 'eris';
import {
    DEFAULT_NOTIFICATION_CONSTANTS,
    EXPLICIT_LEVEL_CONSTANTS,
    REGIONS_CONSTANTS,
    VERIFICATION_LEVEL_CONSTANTS,
} from '../../constants/ServerConstants';
import { secondsToString } from '@utilly/utils';

interface ChangedData {
    name: string;
    old: string;
    new: string;
}

/**
 * Logging Module for Server Events
 */
export default class ServerLogging extends AttachableModule {
    parentModule!: LoggingModule;

    attach(): void {
        this.bot.on('guildUpdate', this._guildUpdate.bind(this));
    }

    private async _guildUpdate(
        guild: Guild,
        oldGuild: OldGuild
    ): Promise<void> {
        //#region prep
        const guildRow = await this.parentModule.selectGuildRow(
            guild.id,
            'guildUpdate'
        );

        if (!guildRow.logging || !guildRow.logging_guildUpdateEvent) return;

        const logChannel: TextChannel | null = this.parentModule.getLogChannel(
            guild,
            guildRow.logging_guildUpdateChannel
        );
        if (logChannel == null) return;

        const embed = new EmbedBuilder();
        embed.setTitle('Server Updated');

        // #region overview
        const overviewData: ChangedData[] = [];
        if (guild.name != oldGuild.name)
            overviewData.push({
                name: 'Name',
                old: oldGuild.name,
                new: guild.name,
            });
        if (guild.region != oldGuild.region) {
            const regions = await REGIONS_CONSTANTS(guild);
            overviewData.push({
                name: 'Region',
                old: regions[oldGuild.region],
                new: regions[guild.region],
            });
        }
        if (guild.afkChannelID != oldGuild.afkChannelID)
            overviewData.push({
                name: 'Inactive Channel',
                old: oldGuild.afkChannelID
                    ? guild.channels.get(oldGuild.afkChannelID)?.mention ??
                      'No Inactive Channel'
                    : 'No Inactive Channel',
                new: guild.afkChannelID
                    ? guild.channels.get(guild.afkChannelID)?.mention ??
                      'No Inactive Channel'
                    : 'No Inactive Channel',
            });
        if (guild.afkTimeout != oldGuild.afkTimeout)
            overviewData.push({
                name: 'Inactive Timeout',
                old: secondsToString(oldGuild.afkTimeout),
                new: secondsToString(guild.afkTimeout),
            });
        if (guild.systemChannelID != oldGuild.systemChannelID)
            overviewData.push({
                name: 'System Messages Channel',
                old: oldGuild.systemChannelID
                    ? guild.channels.get(oldGuild.systemChannelID)?.mention ??
                      'No System Messages'
                    : 'No System Messages',
                new: guild.systemChannelID
                    ? guild.channels.get(guild.systemChannelID)?.mention ??
                      'No System Messages'
                    : 'No System Messages',
            });

        if (guild.systemChannelFlags != oldGuild.systemChannelFlags) {
            if (
                (guild.systemChannelFlags & 1) !=
                (oldGuild.systemChannelFlags & 1)
            )
                overviewData.push({
                    name: 'Welcome Message',
                    old: oldGuild.systemChannelFlags & 1 ? 'No' : 'Yes',
                    new: guild.systemChannelFlags & 1 ? 'No' : 'Yes',
                });
            if (
                (guild.systemChannelFlags & 2) !=
                (oldGuild.systemChannelFlags & 2)
            )
                overviewData.push({
                    name: 'Boost Message',
                    old: oldGuild.systemChannelFlags & 2 ? 'No' : 'Yes',
                    new: guild.systemChannelFlags & 2 ? 'No' : 'Yes',
                });
        }
        if (guild.defaultNotifications != oldGuild.defaultNotifications)
            overviewData.push({
                name: 'Default Notification Settings',
                old:
                    DEFAULT_NOTIFICATION_CONSTANTS[
                        oldGuild.defaultNotifications
                    ],
                new: DEFAULT_NOTIFICATION_CONSTANTS[guild.defaultNotifications],
            });
        const overview = overviewData
            .map(item => `**${item.name}**: ${item.old} ➜ ${item.new}`)
            .join('\n');
        // #endregion

        // #region moderation
        const moderationData: ChangedData[] = [];
        if (guild.verificationLevel != oldGuild.verificationLevel)
            moderationData.push({
                name: 'Verification Level',
                old: VERIFICATION_LEVEL_CONSTANTS[oldGuild.verificationLevel],
                new: VERIFICATION_LEVEL_CONSTANTS[guild.verificationLevel],
            });
        if (guild.explicitContentFilter != oldGuild.explicitContentFilter)
            moderationData.push({
                name: 'Explicit Media Content Filter',
                old: EXPLICIT_LEVEL_CONSTANTS[oldGuild.explicitContentFilter],
                new: EXPLICIT_LEVEL_CONSTANTS[guild.explicitContentFilter],
            });
        if (guild.mfaLevel != oldGuild.mfaLevel)
            moderationData.push({
                name: '2FA Requirement For Moderation',
                old: oldGuild.mfaLevel == 0 ? 'Off' : 'On',
                new: guild.mfaLevel == 0 ? 'Off' : 'On',
            });
        const moderation = moderationData
            .map(item => `**${item.name}**: ${item.old} ➜ ${item.new}`)
            .join('\n');
        // #endregion

        if (overview != '') embed.addField('Overview', overview);
        if (moderation != '') embed.addField('Moderation', moderation);

        embed.setTimestamp();
        embed.setAuthor(guild.name, undefined, guild.iconURL ?? undefined);

        this.parentModule.sendLogMessage(logChannel, embed);
    }
}

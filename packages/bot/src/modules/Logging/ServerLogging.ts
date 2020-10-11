import { AttachableModule, EmbedBuilder } from '@utilly/framework';
import type LoggingModule from './LoggingModule';
import type { Guild, OldGuild, TextChannel } from 'eris';
import {
    DEFAULT_NOTIFICATION_CONSTANTS,
    EXPLICIT_LEVEL_CONSTANTS_SHORT,
    REGIONS_CONSTANTS,
    VERIFICATION_LEVEL_CONSTANTS_SHORT,
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
        newGuild: Guild,
        oldGuild: OldGuild
    ): Promise<void> {
        //#region prep
        const guildRow = await this.parentModule.selectGuildRow(
            newGuild.id,
            'guildUpdate'
        );

        if (!guildRow.logging || !guildRow.logging_guildUpdateEvent) return;

        const logChannel: TextChannel | null = this.parentModule.getLogChannel(
            newGuild,
            guildRow.logging_guildUpdateChannel
        );
        if (logChannel == null) return;

        const { check, xmark } = this.parentModule.getEmotes(logChannel);

        const embed = new EmbedBuilder();
        embed.setTitle('Server Updated');

        // #region overview
        const overviewData: ChangedData[] = [];
        if (newGuild.name != oldGuild.name)
            overviewData.push({
                name: 'Name',
                old: oldGuild.name,
                new: newGuild.name,
            });
        if (newGuild.region != oldGuild.region) {
            const regions = await REGIONS_CONSTANTS(newGuild);
            overviewData.push({
                name: 'Region',
                old: regions[oldGuild.region],
                new: regions[newGuild.region],
            });
        }
        if (newGuild.afkChannelID != oldGuild.afkChannelID)
            overviewData.push({
                name: 'Inactive Channel',
                old: oldGuild.afkChannelID
                    ? newGuild.channels.get(oldGuild.afkChannelID)?.mention ??
                      'No Inactive Channel'
                    : 'No Inactive Channel',
                new: newGuild.afkChannelID
                    ? newGuild.channels.get(newGuild.afkChannelID)?.mention ??
                      'No Inactive Channel'
                    : 'No Inactive Channel',
            });
        if (newGuild.afkTimeout != oldGuild.afkTimeout)
            overviewData.push({
                name: 'Inactive Timeout',
                old: secondsToString(oldGuild.afkTimeout),
                new: secondsToString(newGuild.afkTimeout),
            });
        if (newGuild.systemChannelID != oldGuild.systemChannelID)
            overviewData.push({
                name: 'System Messages Channel',
                old: oldGuild.systemChannelID
                    ? newGuild.channels.get(oldGuild.systemChannelID)
                          ?.mention ?? 'No System Messages'
                    : 'No System Messages',
                new: newGuild.systemChannelID
                    ? newGuild.channels.get(newGuild.systemChannelID)
                          ?.mention ?? 'No System Messages'
                    : 'No System Messages',
            });

        if (newGuild.systemChannelFlags != oldGuild.systemChannelFlags) {
            if (
                (newGuild.systemChannelFlags & 1) !=
                (oldGuild.systemChannelFlags & 1)
            )
                overviewData.push({
                    name: 'Welcome Message',
                    old: oldGuild.systemChannelFlags & 1 ? xmark : check,
                    new: newGuild.systemChannelFlags & 1 ? xmark : check,
                });
            if (
                (newGuild.systemChannelFlags & 2) !=
                (oldGuild.systemChannelFlags & 2)
            )
                overviewData.push({
                    name: 'Boost Message',
                    old: oldGuild.systemChannelFlags & 2 ? xmark : check,
                    new: newGuild.systemChannelFlags & 2 ? xmark : check,
                });
        }
        if (newGuild.defaultNotifications != oldGuild.defaultNotifications)
            overviewData.push({
                name: 'Default Notification Settings',
                old:
                    DEFAULT_NOTIFICATION_CONSTANTS[
                        oldGuild.defaultNotifications
                    ],
                new:
                    DEFAULT_NOTIFICATION_CONSTANTS[
                        newGuild.defaultNotifications
                    ],
            });
        const overview = overviewData
            .map(item => `**${item.name}**: ${item.old} ➜ ${item.new}`)
            .join('\n');
        // #endregion

        // #region moderation
        const moderationData: ChangedData[] = [];
        if (newGuild.verificationLevel != oldGuild.verificationLevel)
            moderationData.push({
                name: 'Verification Level',
                old:
                    VERIFICATION_LEVEL_CONSTANTS_SHORT[
                        oldGuild.verificationLevel
                    ],
                new:
                    VERIFICATION_LEVEL_CONSTANTS_SHORT[
                        newGuild.verificationLevel
                    ],
            });
        if (newGuild.explicitContentFilter != oldGuild.explicitContentFilter)
            moderationData.push({
                name: 'Explicit Media Content Filter',
                old:
                    EXPLICIT_LEVEL_CONSTANTS_SHORT[
                        oldGuild.explicitContentFilter
                    ],
                new:
                    EXPLICIT_LEVEL_CONSTANTS_SHORT[
                        newGuild.explicitContentFilter
                    ],
            });
        if (newGuild.mfaLevel != oldGuild.mfaLevel)
            moderationData.push({
                name: '2FA Requirement For Moderation',
                old: oldGuild.mfaLevel == 0 ? xmark : check,
                new: newGuild.mfaLevel == 0 ? xmark : check,
            });
        const moderation = moderationData
            .map(item => `**${item.name}**: ${item.old} ➜ ${item.new}`)
            .join('\n');
        // #endregion

        if (overview != '') embed.addField('Overview', overview);
        if (moderation != '') embed.addField('Moderation', moderation);

        embed.setTimestamp();
        embed.setAuthor(
            newGuild.name,
            undefined,
            newGuild.iconURL ?? undefined
        );

        this.parentModule.sendLogMessage(logChannel, embed);
    }
}

import {
    AnyGuildChannel,
    CategoryChannel,
    Guild,
    GuildChannel,
    OldGuildChannel,
    Role,
    TextChannel,
    VoiceChannel,
} from 'eris';
import AttachableModule from '../../handlers/ModuleHandler/Submodule/AttachableModule';
import { secondsToString } from '../../helpers/DurationParser';
import EmbedBuilder from '../../helpers/Embed';
import {
    HumanPermissions,
    PermissionList,
    Permissions,
} from '../../helpers/PermissionConstants';
import LoggingModule from './LoggingModule';

/* eslint-disable no-prototype-builtins */

/**
 * Logging Module for Server Events
 */
export default class ServerLogging extends AttachableModule {
    parentModule?: LoggingModule;

    attach(): void {
        this.bot.on('channelCreate', this.channelCreate.bind(this));
        this.bot.on('channelDelete', this.channelDelete.bind(this));
        this.bot.on('channelUpdate', this.channelUpdate.bind(this));

        this.bot.on('guildRoleCreate', this.guildRoleCreate.bind(this));
        this.bot.on('guildRoleDelete', this.guildRoleDelete.bind(this));
        this.bot.on('guildRoleUpdate', this.guildRoleUpdate.bind(this));
    }

    /**
     * Adds a timestamp for partial builds and a guild info and guild id for full builds
     * @param embed - the embed builder
     * @param message - the message
     * @param partial - if the embed build will be partial
     */
    private buildEmbed(
        embed: EmbedBuilder,
        guild: Guild,
        partial = false
    ): EmbedBuilder {
        embed.setTimestamp();

        if (partial) return embed;

        embed.setAuthor(guild.name, undefined, guild.iconURL);
        embed.setFooter(`Server ID: ${guild.id}`);

        return embed;
    }

    /**
     * Handles the event where a role is updated
     * @param guild - the guild
     * @param role - the new role
     * @param oldRole - the old role
     */
    private async guildRoleUpdate(
        guild: Guild,
        role: Role,
        oldRole: Role
    ): Promise<void> {
        if (this.parentModule == undefined)
            throw new Error('Parent Module of Server Logging not injected');

        const guildRow = await this.parentModule.getGuildRow(guild);
        if (
            !(await this.parentModule.preChecks(
                'guildRoleUpdate',
                guild,
                guildRow
            ))
        )
            return;

        const logChannel: TextChannel | null = await this.parentModule.getLogChannel(
            'server',
            guild,
            guildRow
        );
        if (logChannel == null) return;

        // Prepare Embed
        let embed = new EmbedBuilder();
        embed.setTitle('Role Updated');
        embed.setColor(role.color);
        if (role.name != oldRole.name) {
            embed.setDescription(
                `**Name**: ${oldRole.name} ➜ ${role.name}\n**Mention**: ${role.mention}\n`
            );
        } else {
            embed.setDescription(
                `**Name**: ${role.name}\n**Mention**: ${role.mention}\n`
            );
        }

        // Prepare updates to the role info
        const updatedRoleInfo =
            `${
                role.color != oldRole.color
                    ? `**Color**: #${oldRole.color.toString(16)}` +
                      ` ➜ #${role.color.toString(16)}\n`
                    : ''
            }` +
            `${
                role.hoist != oldRole.hoist
                    ? `**Displayed Seperately**: ${
                          oldRole.hoist ? 'Yes' : 'No'
                      } ` + `➜ ${role.hoist ? 'Yes' : 'No'}\n`
                    : ''
            }` +
            `${
                role.mentionable != oldRole.mentionable
                    ? `**Mentionable**: ${
                          oldRole.mentionable ? 'Yes' : 'No'
                      } ` + `➜ ${role.mentionable ? 'Yes' : 'No'}\n`
                    : ''
            }` +
            `${
                role.managed != oldRole.managed
                    ? `**Managed**: ${oldRole.managed ? 'Yes' : 'No'} ` +
                      `➜ ${role.managed ? 'Yes' : 'No'}`
                    : ''
            }`;
        if (updatedRoleInfo != '') embed.addField('Info', updatedRoleInfo);

        // Prepare updates to the permissions
        let permissionField = '';
        for (let i = 0; i < PermissionList.length; i++) {
            const permission = PermissionList[i];
            if (
                oldRole.permissions.has(permission) &&
                !role.permissions.has(permission)
            ) {
                //Permissions go from allow to deny
                permissionField += `${
                    HumanPermissions[Permissions[permission]]
                } : ✅ ➜ ❎\n`;
            } else if (
                !oldRole.permissions.has(permission) &&
                role.permissions.has(permission)
            ) {
                //Permissiongs go from deny to allow
                permissionField += `${
                    HumanPermissions[Permissions[permission]]
                } : ❎ ➜ ✅\n`;
            }
        }
        if (permissionField != '')
            embed.addField('Permissions', permissionField, true);

        // Final additions and send
        if (embed.fields == undefined || embed.fields.length == 0) return;
        embed = this.buildEmbed(embed, guild);
        logChannel.createMessage({ embed });
    }

    /**
     * Handles the event where a role is deleted
     * @param guild - the guild
     * @param role - the deleted role
     */
    private async guildRoleDelete(guild: Guild, role: Role): Promise<void> {
        if (this.parentModule == undefined)
            throw new Error('Parent Module of Server Logging not injected');

        const guildRow = await this.parentModule.getGuildRow(guild);
        if (
            !(await this.parentModule.preChecks(
                'guildRoleDelete',
                guild,
                guildRow
            ))
        )
            return;

        const logChannel: TextChannel | null = await this.parentModule.getLogChannel(
            'server',
            guild,
            guildRow
        );
        if (logChannel == null) return;

        // Prepare Embed
        let embed = new EmbedBuilder();
        embed.setTitle('Role Deleted');
        embed.setColor(role.color);
        embed.setDescription(`**Name**: ${role.name}`);

        // Prepare role info
        embed.addField(
            'Info',
            `**Color**: #${role.color.toString(16)}\n` +
                `**Displayed Seperately**: ${role.hoist ? 'Yes' : 'No'}\n` +
                `**Mentionable**: ${role.mentionable ? 'Yes' : 'No'}\n` +
                `**Managed**: ${role.managed ? 'Yes' : 'No'}`
        );

        // Prepare permission info
        let permissionField = '';
        for (let i = 0; i < PermissionList.length; i++) {
            const permission = PermissionList[i];
            permissionField += `${
                HumanPermissions[Permissions[permission]]
            } : ${role.permissions.has(permission) ? '✅' : '❎'}\n`;
        }
        if (permissionField != '')
            embed.addField('Permissions', permissionField, true);

        // Final additions and send
        embed = this.buildEmbed(embed, guild);
        logChannel.createMessage({ embed });
    }

    /**
     * Handles the event where a role is created
     * @param guild - the guild
     * @param role - the created role
     */
    private async guildRoleCreate(guild: Guild, role: Role): Promise<void> {
        if (this.parentModule == undefined)
            throw new Error('Parent Module of Server Logging not injected');

        const guildRow = await this.parentModule.getGuildRow(guild);
        if (
            !(await this.parentModule.preChecks(
                'guildRoleCreate',
                guild,
                guildRow
            ))
        )
            return;

        const logChannel: TextChannel | null = await this.parentModule.getLogChannel(
            'server',
            guild,
            guildRow
        );
        if (logChannel == null) return;

        // Prepare Embed
        let embed = new EmbedBuilder();
        embed.setTitle('Role Created');
        embed.setColor(role.color);
        embed.setDescription(
            `**Name**: ${role.name}\n**Mention**: ${role.mention}\n`
        );

        // Prepare role info
        embed.addField(
            'Info',
            `**Color**: #${role.color.toString(16)}\n` +
                `**Displayed Seperately**: ${role.hoist ? 'Yes' : 'No'}\n` +
                `**Mentionable**: ${role.mentionable ? 'Yes' : 'No'}\n` +
                `**Managed**: ${role.managed ? 'Yes' : 'No'}`
        );

        // Prepare permission info
        let permissionField = '';
        for (let i = 0; i < PermissionList.length; i++) {
            const permission = PermissionList[i];
            permissionField += `${
                HumanPermissions[Permissions[permission]]
            } : ${role.permissions.has(permission) ? '✅' : '❎'}\n`;
        }
        if (permissionField != '')
            embed.addField('Permissions', permissionField, true);

        // Final additions and send
        embed = this.buildEmbed(embed, guild);
        logChannel.createMessage({ embed });
    }

    /**
     * Handles the event where a channel is updated
     * @param newChannel - the new channel
     * @param oldChannel - the old channel
     */
    private async channelUpdate(
        newChannel: GuildChannel,
        oldChannel: OldGuildChannel
    ): Promise<void> {
        if (this.parentModule == undefined)
            throw new Error('Parent Module of Server Logging not injected');

        const guildRow = await this.parentModule.getGuildRow(newChannel.guild);
        if (
            !(await this.parentModule.preChecks(
                'channelUpdate',
                newChannel.guild,
                guildRow
            ))
        )
            return;

        const logChannel: TextChannel | null = await this.parentModule.getLogChannel(
            'server',
            newChannel.guild,
            guildRow
        );
        if (logChannel == null) return;

        let embed = new EmbedBuilder();
        let overview = '';

        if (newChannel.name != oldChannel.name) {
            overview += `**Name**: ${oldChannel.name} ➜ ${newChannel.name}\n`;
        }

        // Prepare Embed Header and Overview changes
        if (newChannel instanceof TextChannel) {
            embed.setTitle('Text Channel Updated');
            embed.setDescription(
                `Channel: <#${newChannel.id}>\nChannel ID: ${newChannel.id}`
            );

            if (
                newChannel.topic != oldChannel.topic &&
                oldChannel.topic != undefined &&
                newChannel.topic != undefined
            )
                overview +=
                    `**Topic**: ${oldChannel.topic ?? '(cleared)'}` +
                    ` ➜ ${newChannel.topic ?? '(cleared)'}\n`;

            if (newChannel.rateLimitPerUser != oldChannel.rateLimitPerUser)
                overview +=
                    `**Slowmode**: ${
                        oldChannel.rateLimitPerUser != undefined
                            ? secondsToString(oldChannel.rateLimitPerUser)
                            : 'Off'
                    }` +
                    ` ➜ ${
                        newChannel.rateLimitPerUser != undefined
                            ? secondsToString(newChannel.rateLimitPerUser)
                            : 'Off'
                    }\n`;

            if (newChannel.nsfw != oldChannel.nsfw)
                overview +=
                    `**NSFW**: ${oldChannel.nsfw ? '✅' : '❎'} ` +
                    `➜ ${newChannel.nsfw ? '✅' : '❎'}\n`;

            if (newChannel.parentID != oldChannel.parentID) {
                overview +=
                    `**Category**: ${
                        (oldChannel.parentID &&
                            newChannel.guild.channels.get(oldChannel.parentID)
                                ?.name) ??
                        '(none)'
                    }` +
                    ` ➜ ${
                        (newChannel.parentID &&
                            newChannel.guild.channels.get(newChannel.parentID)
                                ?.name) ??
                        '(none)'
                    }\n`;
            }

            if (overview != '') embed.addField('Overview', overview);
        } else if (newChannel instanceof VoiceChannel) {
            embed.setTitle('Voice Channel Updated');
            embed.setDescription(
                `Channel: ${newChannel.name}\nChannel ID: ${newChannel.id}`
            );
            console.log(newChannel.userLimit, oldChannel.userLimit);
            if (
                newChannel.bitrate != oldChannel.bitrate &&
                newChannel.bitrate != undefined &&
                oldChannel.bitrate != undefined
            ) {
                overview += `**Bitrate**: ${oldChannel.bitrate / 1000}kbps ➜ ${
                    newChannel.bitrate / 1000
                }kbps\n`;
            }

            if (newChannel.userLimit != oldChannel.userLimit) {
                overview +=
                    `**User Limit**: ${
                        oldChannel.userLimit == 0 ||
                        oldChannel.userLimit == undefined
                            ? 'No Limit'
                            : `${oldChannel.userLimit} users`
                    } ➜ ` +
                    `${
                        newChannel.userLimit == 0 ||
                        newChannel.userLimit == undefined
                            ? 'No Limit'
                            : `${newChannel.userLimit} users`
                    }\n`;
            }
            if (newChannel.parentID != oldChannel.parentID) {
                overview +=
                    `**Category**: ${
                        (oldChannel.parentID &&
                            newChannel.guild.channels.get(oldChannel.parentID)
                                ?.name) ??
                        '(none)'
                    }` +
                    ` ➜ ${
                        (newChannel.parentID &&
                            newChannel.guild.channels.get(newChannel.parentID)
                                ?.name) ??
                        '(none)'
                    }\n`;
            }
            if (overview != '') embed.addField('Overview', overview);
        } else if (newChannel instanceof CategoryChannel) {
            embed.setTitle('Category Updated');
            embed.setDescription(
                `**Name**: ${newChannel.name}\nChannel ID: ${newChannel.id}`
            );
        } else {
            embed.setTitle('Channel Updated');
            embed.setDescription(
                `**Name**: ${newChannel.name}\nChannel ID: ${newChannel.id}`
            );
        }

        // Prepare permission changes
        const permissions: Map<string | number, string> = new Map();

        // Loop over old permission overwrites
        for (const [key, oldOverwrite] of oldChannel.permissionOverwrites) {
            // Get the new permission overwrite equivalent, if possible
            const newOverwrite = newChannel.permissionOverwrites.get(key);

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
            if (!permissions.has(key)) {
                if (oldOverwrite.type == 'role') {
                    if (key == newChannel.guild.id) {
                        permissions.set(key, '\n**Role @everyone\n**');
                    } else {
                        permissions.set(key, `\n**Role <@&${key}>\n**`);
                    }
                }
                if (oldOverwrite.type == 'member') {
                    permissions.set(key, `\n**Member <@${key}>\n**`);
                }
            }

            // Loop through the old channel's permission overwrites
            for (const permission in oldOverwrite.json) {
                // Prepare to add to the text
                let changedText = permissions.get(key);
                // Check if the overwrite has the permission allowed
                if (oldOverwrite.has(permission)) {
                    // If there is not a new permission overwrite equivalent, the permission has been cleared
                    if (
                        newOverwrite == null ||
                        newOverwrite.json[permission] == null
                    ) {
                        changedText += `${
                            HumanPermissions[Permissions[permission]]
                        } : ✅ ➜ ⬜\n`;
                        // If the new overwrite doesn't have this permission in allow, the permision has been denied
                    } else if (!newOverwrite.has(permission)) {
                        changedText += `${
                            HumanPermissions[Permissions[permission]]
                        } : ✅ ➜ ❎\n`;
                    }
                    // Check if the overwrite doesn't have the permission allowed
                } else if (!oldOverwrite.has(permission)) {
                    // If there is not a new permission overwrite equivalent, the permission has been cleared
                    if (
                        newOverwrite == null ||
                        newOverwrite.json[permission] == null
                    ) {
                        changedText += `${
                            HumanPermissions[Permissions[permission]]
                        } : ❎ ➜ ⬜\n`;
                        // If the new overwrite has this permission in allow, the permission has been allowed
                    } else if (newOverwrite.has(permission)) {
                        changedText += `${
                            HumanPermissions[Permissions[permission]]
                        } : ❎ ➜ ✅\n`;
                    }
                }
                // Add the updated text into the map
                if (changedText != null) permissions.set(key, changedText);
            }

            // If there is a new overwrite, loop through it
            if (newOverwrite != null) {
                for (const permission in newOverwrite.json) {
                    // If the old channel has this permission, skip it because it was covered
                    if (oldOverwrite.json.hasOwnProperty(permission)) continue;

                    // Prepare to change text
                    let changedText = permissions.get(key);

                    // If the new overwrite doesn't have this permission in allow, an overwrite has been created, denying the permission
                    if (!newOverwrite.has(permission)) {
                        changedText += `${
                            HumanPermissions[Permissions[permission]]
                        } : ⬜ ➜ ❎\n`;
                        // If the new overwrite has this permission in allow, an overwrite has been created, allowing the permission
                    } else if (newOverwrite.has(permission)) {
                        changedText += `${
                            HumanPermissions[Permissions[permission]]
                        } : ⬜ ➜ ✅\n`;
                    }

                    // Add the updated text into the map
                    if (changedText != null) permissions.set(key, changedText);
                }
            }
        }

        // If any permission has been updated, the map size will be greater than 0
        if (permissions.size > 0) {
            // Prepare to have multiple pages of permissions
            const embedPages = [''];
            let current = 0;

            // Loop through the permissions map
            for (const [, value] of permissions) {
                // If the current page is null, add the page in
                if (embedPages[current] == null) {
                    embedPages.push('');
                }
                // If current page's length plus the next overwrite's length is greater than 1024 (embed field maximum)
                // increase the page number
                if (embedPages[current].length + value.length > 1024) {
                    current++;
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
                    embed.addField(
                        `Permission Overwrites ${i + 1}`,
                        embedPages[i],
                        true
                    );
                }
            }
        }

        // Final additions and send message
        embed = this.buildEmbed(embed, newChannel.guild);
        logChannel.createMessage({ embed });
    }

    /**
     * Handles the event where a channel is deleted
     * @param channel - the deleted channel
     */
    private async channelDelete(channel: AnyGuildChannel): Promise<void> {
        if (this.parentModule == undefined)
            throw new Error(
                'Injection error: parent module not injected into module.'
            );
        const guildRow = await this.parentModule.getGuildRow(channel.guild);

        if (
            !(await this.parentModule.preChecks(
                'channelDelete',
                channel.guild,
                guildRow
            ))
        )
            return;
        const logChannel: TextChannel | null = await this.parentModule.getLogChannel(
            'server',
            channel.guild,
            guildRow
        );
        if (logChannel == null) return;

        // Prepare embed
        let embed = new EmbedBuilder();
        let info = '';

        info += `**Name**: ${channel.name}\n`;
        // Add embed header and info
        if (channel instanceof TextChannel) {
            embed.setTitle('Text Channel Deleted');
            if (channel.parentID) {
                info += `**Category**: ${
                    channel.guild.channels.get(channel.parentID)?.name
                }`;
            }

            if (info != '') embed.addField('Info', info);
        } else if (channel instanceof VoiceChannel) {
            embed.setTitle('Voice Channel Deleted');
            if (channel.parentID) {
                info += `**Category**: ${
                    channel.guild.channels.get(channel.parentID)?.name
                }`;
            }

            if (info != '') embed.addField('Info', info);
        } else if (channel instanceof CategoryChannel) {
            embed.setTitle('Category Deleted');
            if (info != '') embed.addField('Info', info);
        } else {
            embed.setTitle('Channel Deleted');
            if (channel.parentID) {
                info += `**Category**: ${
                    channel.guild.channels.get(channel.parentID)?.name
                }`;
            }

            if (info != '') embed.addField('Info', info);
        }

        // Setup permission map
        const permissions: Map<string | number, string> = new Map();
        // Loop through the permission overwrites
        for (const [key, value] of channel.permissionOverwrites) {
            // If the permission map doesn't have the overwrites, add the header
            if (!permissions.has(key)) {
                if (value.type == 'role') {
                    if (key == channel.guild.id) {
                        permissions.set(key, '\n**Role @everyone\n**');
                    } else {
                        permissions.set(key, `\n**Role <@&${key}>\n**`);
                    }
                } else if (value.type == 'member') {
                    permissions.set(key, `\n**Member <@${key}>\n**`);
                }
            }

            // Loop through the permissions and add a check or x depending on if the permission is allowed or denied
            for (const permission in value.json) {
                let changedText = permissions.get(key);
                if (value.json[permission]) {
                    changedText += `${HumanPermissions[value.allow]} : ✅\n`;
                } else if (!value.json[permission]) {
                    changedText += `${HumanPermissions[value.deny]} : ❎\n`;
                }
                if (changedText != null) permissions.set(key, changedText);
            }
        }
        // If any permission has been updated, the map size will be greater than 0
        if (permissions.size > 0) {
            // Add the permission overwrite
            let permissionOverwrites = '';
            for (const [, value] of permissions) {
                permissionOverwrites += value;
            }
            embed.addField('Permission Overwrites', permissionOverwrites, true);
        }

        // Final additions and send
        embed = this.buildEmbed(embed, channel.guild);
        logChannel.createMessage({ embed });
    }

    /**
     * Handles the event where a channel is created
     * @param channel - the created channel
     */
    private async channelCreate(channel: GuildChannel): Promise<void> {
        if (this.parentModule == undefined)
            throw new Error(
                'Injection error: parent module not injected into module.'
            );
        const guildRow = await this.parentModule.getGuildRow(channel.guild);

        if (
            !(await this.parentModule.preChecks(
                'channelCreate',
                channel.guild,
                guildRow
            ))
        )
            return;
        const logChannel: TextChannel | null = await this.parentModule.getLogChannel(
            'server',
            channel.guild,
            guildRow
        );
        if (logChannel == null) return;

        // Prepare embed
        let embed = new EmbedBuilder();
        let info = '';

        info += `**Name**: ${channel.name}\n`;
        // Add embed header and info
        if (channel instanceof TextChannel) {
            embed.setTitle('Text Channel Created');
            if (channel.parentID) {
                info += `**Category**: ${
                    channel.guild.channels.get(channel.parentID)?.name
                }`;
            }

            if (info != '') embed.addField('Info', info);
        } else if (channel instanceof VoiceChannel) {
            embed.setTitle('Voice Channel Created');
            if (channel.parentID) {
                info += `**Category**: ${
                    channel.guild.channels.get(channel.parentID)?.name
                }`;
            }

            if (info != '') embed.addField('Info', info);
        } else if (channel instanceof CategoryChannel) {
            embed.setTitle('Category Created');
            if (info != '') embed.addField('Info', info);
        } else {
            embed.setTitle('Channel Created');
            if (channel.parentID) {
                info += `**Category**: ${
                    channel.guild.channels.get(channel.parentID)?.name
                }`;
            }

            if (info != '') embed.addField('Info', info);
        }

        // Setup permission map
        const permissions: Map<string | number, string> = new Map();
        // Loop through the permission overwrites
        for (const [key, value] of channel.permissionOverwrites) {
            // If the permission map doesn't have the overwrites, add the header
            if (!permissions.has(key)) {
                if (value.type == 'role') {
                    if (key == channel.guild.id) {
                        permissions.set(key, '\n**Role @everyone\n**');
                    } else {
                        permissions.set(key, `\n**Role <@&${key}>\n**`);
                    }
                } else if (value.type == 'member') {
                    permissions.set(key, `\n**Member <@${key}>\n**`);
                }
            }

            // Loop through the permissions and add a check or x depending on if the permission is allowed or denied
            for (const permission in value.json) {
                console.log(permission);

                let changedText = permissions.get(key);
                if (value.json[permission]) {
                    changedText += `${HumanPermissions[value.allow]} : ✅\n`;
                } else if (!value.json[permission]) {
                    changedText += `${HumanPermissions[value.deny]} : ❎\n`;
                }
                if (changedText != null) permissions.set(key, changedText);
            }
        }
        // If any permission has been updated, the map size will be greater than 0
        if (permissions.size > 0) {
            // Add the permission overwrite
            let permissionOverwrites = '';
            for (const [, value] of permissions) {
                permissionOverwrites += value;
            }
            embed.addField('Permission Overwrites', permissionOverwrites, true);
        }

        // Final additions and send
        embed = this.buildEmbed(embed, channel.guild);
        logChannel.createMessage({ embed });
    }
}

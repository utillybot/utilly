import {
    AttachableModule,
    EmbedBuilder,
    ROLE_PERMISSIONS,
} from '@utilly/framework';
import type { Guild, OldRole, Role, TextChannel } from 'eris';
import type LoggingModule from './LoggingModule';

/* eslint-disable no-prototype-builtins */

/**
 * Logging Module for Server Events
 */
export default class RoleLogging extends AttachableModule {
    parentModule!: LoggingModule;

    attach(): void {
        this.bot.on('guildRoleCreate', this._guildRoleCreate.bind(this));
        this.bot.on('guildRoleDelete', this._guildRoleDelete.bind(this));
        this.bot.on('guildRoleUpdate', this._guildRoleUpdate.bind(this));
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
     * Handles the event where a role is updated
     * @param guild - the guild
     * @param role - the new role
     * @param oldRole - the old role
     */
    private async _guildRoleUpdate(
        guild: Guild,
        role: Role,
        oldRole: OldRole
    ): Promise<void> {
        //#region prep
        const guildRow = await this.parentModule.selectGuildRow(
            guild.id,
            'guildRoleUpdate'
        );

        if (!guildRow.logging || !guildRow.logging_guildRoleUpdateEvent) return;

        const logChannel: TextChannel | null = this.parentModule.getLogChannel(
            guild,
            guildRow.logging_guildRoleUpdateChannel
        );
        if (logChannel == null) return;

        const { check, xmark } = this.parentModule.getEmotes(logChannel);

        //#endregion

        //#region embed header
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
                    ? `**Displayed Separately**: ${
                          oldRole.hoist ? check : xmark
                      } ` + `➜ ${role.hoist ? check : xmark}\n`
                    : ''
            }` +
            `${
                role.mentionable != oldRole.mentionable
                    ? `**Mentionable**: ${
                          oldRole.mentionable ? check : xmark
                      } ` + `➜ ${role.mentionable ? check : xmark}\n`
                    : ''
            }` +
            `${
                role.managed != oldRole.managed
                    ? `**Managed**: ${oldRole.managed ? check : xmark} ` +
                      `➜ ${role.managed ? check : xmark}`
                    : ''
            }`;
        if (updatedRoleInfo != '') embed.addField('Info', updatedRoleInfo);
        embed.setFooter(`Role ID: ${role.id}`);

        //#endregion

        //#region permissions
        // Prepare updates to the permissions
        const permissions: string[] = [];
        for (const [permissionBit, permission] of ROLE_PERMISSIONS) {
            if (
                oldRole.permissions.allow & permissionBit &&
                !(role.permissions.allow & permissionBit)
            ) {
                //Permissions go from allow to deny
                permissions.push(`${permission}: ${check} ➜ ${xmark}\n`);
            } else if (
                !(oldRole.permissions.allow & permissionBit) &&
                role.permissions.allow & permissionBit
            ) {
                //Permissiongs go from deny to allow
                permissions.push(`${permission}: ${xmark} ➜ ${check}\n`);
            }
        }
        // If any permission has been updated, the map size will be greater than 0
        if (permissions.length > 0) {
            // Prepare to have multiple pages of permissions
            const embedPages = [''];
            let current = 0;

            // Loop through the permissions map
            for (const permission of permissions) {
                // If current page's length plus the next overwrite's length is greater than 1024 (embed field maximum)
                // increase the page number
                if (embedPages[current].length + permission.length > 1024) {
                    current++;
                }
                // If the current page is null, add the page in
                if (embedPages[current] == null) {
                    embedPages.push('');
                }
                // Add the permission overwrite data to the current page
                embedPages[current] += permission;
            }

            // If there is only 1 page, add that page to the embed
            if (embedPages.length == 1) {
                embed.addField('Permissions', embedPages[0], true);
                // Otherwise, loop through the pages and add each one to the embed
            } else {
                for (let i = 0; i < embedPages.length; i++) {
                    embed.addField(`Permissions ${i + 1}`, embedPages[i], true);
                }
            }
        }
        //#endregion

        // Final additions and send
        if (embed.fields == undefined || embed.fields.length == 0) return;
        embed = this._buildEmbed(embed, guild);
        this.parentModule.sendLogMessage(logChannel, embed);
    }

    /**
     * Handles the event where a role is deleted
     * @param guild - the guild
     * @param role - the deleted role
     */
    private async _guildRoleDelete(guild: Guild, role: Role): Promise<void> {
        //#region prep
        const guildRow = await this.parentModule.selectGuildRow(
            guild.id,
            'guildRoleDelete'
        );

        if (!guildRow.logging || !guildRow.logging_guildRoleDeleteEvent) return;

        const logChannel: TextChannel | null = this.parentModule.getLogChannel(
            guild,
            guildRow.logging_guildRoleDeleteChannel
        );
        if (logChannel == null) return;
        //#endregion

        this._guildRoleCD(
            guild,
            role,
            logChannel,
            'Deleted',
            this.parentModule.getEmotes(logChannel)
        );
    }

    /**
     * Handles the event where a role is created
     * @param guild - the guild
     * @param role - the created role
     */
    private async _guildRoleCreate(guild: Guild, role: Role): Promise<void> {
        //#region prep
        const guildRow = await this.parentModule.selectGuildRow(
            guild.id,
            'guildRoleCreate'
        );

        if (!guildRow.logging || !guildRow.logging_guildRoleCreateEvent) return;

        const logChannel: TextChannel | null = this.parentModule.getLogChannel(
            guild,
            guildRow.logging_guildRoleCreateChannel
        );
        if (logChannel == null) return;
        //#endregion

        this._guildRoleCD(
            guild,
            role,
            logChannel,
            'Created',
            this.parentModule.getEmotes(logChannel)
        );
    }

    private async _guildRoleCD(
        guild: Guild,
        role: Role,
        logChannel: TextChannel,
        request: string,
        emotes: { check: string; xmark: string; empty: string }
    ): Promise<void> {
        const { check, xmark } = emotes;

        //#region embed header
        // Prepare Embed
        let embed = new EmbedBuilder();
        embed.setTitle(`Role ${request}`);
        embed.setColor(role.color);
        embed.setDescription(
            `**Name**: ${role.name}\n${
                request == 'Created' ? `**Mention**: ${role.mention}` : ''
            }\n`
        );

        // Prepare role info
        embed.addField(
            'Info',
            `**Color**: #${role.color.toString(16)}\n` +
                `**Displayed Seperately**: ${role.hoist ? check : xmark}\n` +
                `**Mentionable**: ${role.mentionable ? check : xmark}\n` +
                `**Managed**: ${role.managed ? check : xmark}`
        );
        embed.setFooter(`Role ID: ${role.id}`);
        //#endregion

        //#region permissions
        // Prepare permission info
        const permissions: string[] = [];
        for (const [permissionBit, permission] of ROLE_PERMISSIONS) {
            permissions.push(
                `${permission}: ${
                    role.permissions.allow & permissionBit ? check : xmark
                }\n`
            );
        }
        // If any permission has been updated, the map size will be greater than 0
        if (permissions.length > 0) {
            // Prepare to have multiple pages of permissions
            const embedPages = [''];
            let current = 0;

            // Loop through the permissions map
            for (const permission of permissions) {
                // If current page's length plus the next overwrite's length is greater than 1024 (embed field maximum)
                // increase the page number
                if (embedPages[current].length + permission.length > 1024) {
                    current++;
                }
                // If the current page is null, add the page in
                if (embedPages[current] == null) {
                    embedPages.push('');
                }
                // Add the permission overwrite data to the current page
                embedPages[current] += permission;
            }

            // If there is only 1 page, add that page to the embed
            if (embedPages.length == 1) {
                embed.addField('Permissions', embedPages[0], true);
                // Otherwise, loop through the pages and add each one to the embed
            } else {
                for (let i = 0; i < embedPages.length; i++) {
                    embed.addField(`Permissions ${i + 1}`, embedPages[i], true);
                }
            }
        }
        //#endregion

        // Final additions and send
        embed = this._buildEmbed(embed, guild);
        this.parentModule.sendLogMessage(logChannel, embed);
    }
}

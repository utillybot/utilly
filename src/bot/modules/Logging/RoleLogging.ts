import { Guild, Role, TextChannel } from 'eris';
import { RolePermissions } from '../../constants/PermissionConstants';
import AttachableModule from '../../handlers/ModuleHandler/Submodule/AttachableModule';
import EmbedBuilder from '../../utilities/EmbedBuilder';
import LoggingModule from './LoggingModule';

/* eslint-disable no-prototype-builtins */

/**
 * Logging Module for Server Events
 */
export default class RoleLogging extends AttachableModule {
    parentModule!: LoggingModule;

    attach(): void {
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
    private buildEmbed(embed: EmbedBuilder, guild: Guild): EmbedBuilder {
        embed.setTimestamp();
        embed.setAuthor(guild.name, undefined, guild.iconURL);

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
        embed.setFooter(`Role ID: ${role.id}`);

        //#endregion

        //#region permissions
        // Prepare updates to the permissions
        let permissionField = '';
        for (const [permissionBit, permission] of RolePermissions) {
            if (
                oldRole.permissions.allow & permissionBit &&
                !(role.permissions.allow & permissionBit)
            ) {
                //Permissions go from allow to deny
                permissionField += `${permission}: ✅ ➜ ❎\n`;
            } else if (
                !(oldRole.permissions.allow & permissionBit) &&
                role.permissions.allow & permissionBit
            ) {
                //Permissiongs go from deny to allow
                permissionField += `${permission}: ❎ ➜ ✅\n`;
            }
        }
        if (permissionField != '')
            embed.addField('Permissions', permissionField, true);
        //#endregion

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

        this.guildRoleCD(guild, role, logChannel, 'Deleted');
    }

    /**
     * Handles the event where a role is created
     * @param guild - the guild
     * @param role - the created role
     */
    private async guildRoleCreate(guild: Guild, role: Role): Promise<void> {
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

        this.guildRoleCD(guild, role, logChannel, 'Created');
    }

    private async guildRoleCD(
        guild: Guild,
        role: Role,
        logChannel: TextChannel,
        request: string
    ): Promise<void> {
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
                `**Displayed Seperately**: ${role.hoist ? 'Yes' : 'No'}\n` +
                `**Mentionable**: ${role.mentionable ? 'Yes' : 'No'}\n` +
                `**Managed**: ${role.managed ? 'Yes' : 'No'}`
        );
        embed.setFooter(`Role ID: ${role.id}`);
        //#endregion

        //#region permissions
        // Prepare permission info
        let permissionField = '';
        for (const [permissionBit, permission] of RolePermissions) {
            permissionField += `${permission}: ${
                role.permissions.allow & permissionBit ? '✅' : '❎'
            }\n`;
        }
        if (permissionField != '')
            embed.addField('Permissions', permissionField, true);
        //#endregion

        // Final additions and send
        embed = this.buildEmbed(embed, guild);
        logChannel.createMessage({ embed });
    }
}

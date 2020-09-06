import type { CommandContext, UtillyClient } from '@utilly/framework';
import { BaseCommand, EmbedBuilder } from '@utilly/framework';
import { secondsToString } from '@utilly/utils';
import {
    DEFAULT_NOTIFICATION_CONSTANTS,
    EXPLICIT_LEVEL_CONSTANTS,
    REGIONS_CONSTANTS,
    VERIFICATION_LEVEL_CONSTANTS,
} from '../../constants/ServerConstants';
import type InfoCommandModule from './moduleinfo';

export default class ServerInfo extends BaseCommand {
    parent?: InfoCommandModule;

    constructor(bot: UtillyClient, parent: InfoCommandModule) {
        super(bot, parent);
        this.help.name = 'serverinfo';
        this.help.description = 'View information about a server';
        this.help.usage = '';
        this.help.aliases = ['sinfo'];
        this.settings.guildOnly = true;
        this.permissions.botPerms = ['embedLinks'];
    }

    async execute(ctx: CommandContext): Promise<void> {
        if (!ctx.guild) return;
        const server = ctx.guild;
        const embed = new EmbedBuilder();
        embed.setTitle('Server Info');

        embed.addField('Name', server.name, true);
        embed.addField('ID', server.id, true);
        embed.addField(
            'Region',
            (await REGIONS_CONSTANTS(server))[server.region]
        );

        embed.addField(
            'Inactive Channel',
            server.afkChannelID
                ? server.channels.get(server.afkChannelID)?.mention ??
                      'No Inactive Channel'
                : 'No Inactive Channel',
            true
        );
        embed.addField(
            'Inactive Timeout',
            secondsToString(server.afkTimeout),
            true
        );

        if (server.systemChannelID) {
            embed.addField(
                'System Messages Channel',
                server.channels.get(server.systemChannelID)?.mention || '',
                true
            );
            /*embed.addField(
                'Send a random welcome message when someone joins this server.',
                'hi'
            );*/
        }

        embed.addField(
            'Default Notifications',
            DEFAULT_NOTIFICATION_CONSTANTS[server.defaultNotifications],
            true
        );
        embed.addField(
            'Created At',
            new Date(server.createdAt).toUTCString(),
            true
        );

        embed.addField(
            'Verification Level',
            VERIFICATION_LEVEL_CONSTANTS[server.verificationLevel],
            true
        );
        embed.addField(
            'Explicit Media Content Filter',
            EXPLICIT_LEVEL_CONSTANTS[server.explicitContentFilter],
            true
        );
        embed.addField(
            '2FA Requirement For Moderation',
            server.mfaLevel == 0 ? 'Off' : 'On',
            true
        );

        embed.addField('Member Count', server.memberCount.toString(), true);
        embed.addField(
            'Owner',
            ctx.guild?.members.get(server.ownerID)?.mention || 'Not found',
            true
        );

        /*
        embed.addField(
            'Roles',
            server.roles
                .map(role => role.mention)
                .reverse()
                .join('\n'),
            true
        );

        embed.addField(
            'Channels',
            server.channels
                .filter(channel =>
                    channel
                        .permissionsOf(ctx.message.author.id)
                        .has('readMessages')
                )
                .map(channel => {
                    if (channel instanceof TextChannel) {
                        return channel.mention;
                    } else if (channel instanceof CategoryChannel) {
                        return `- **${channel.name}** -`;
                    } else {
                        return channel.name;
                    }
                })
                .join('\n'),
            true
        );

        
        if (server.emojis.length > 0)
            embed.addField(
                'Emojis',
                server.emojis
                    .map(emoji => {
                        if (emoji.animated) {
                            return `<a:${emoji.name}:${emoji.id}>`;
                        } else {
                            return `<:${emoji.name}:${emoji.id}>`;
                        }
                    })
                    .join(''),
                true
            );
*/

        if (server.publicUpdatesChannelID)
            embed.addField(
                'Community Updates Channel',
                server.channels.get(server.publicUpdatesChannelID)?.mention ||
                    '',
                true
            );

        if (server.rulesChannelID)
            embed.addField(
                'Rules Channel',
                server.channels.get(server.rulesChannelID)?.mention || '',
                true
            );

        if (server.maxMembers)
            embed.addField('Max Members', server.maxMembers.toString(), true);

        if (server.maxVideoChannelUsers)
            embed.addField(
                'Max Video Channel Users',
                server.maxVideoChannelUsers.toString(),
                true
            );

        if (server.description)
            embed.addField('Description', server.description, true);
        if (server.bannerURL) embed.setImage(server.bannerURL);
        if (server.iconURL) embed.setThumbnail(server.iconURL);

        ctx.reply({ embed });
    }
}

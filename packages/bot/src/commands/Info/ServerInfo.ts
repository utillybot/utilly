import type { CommandContext } from '@utilly/framework';
import {
    BaseCommand,
    BotPermsValidatorHook,
    ChannelValidatorHook,
    Command,
    EmbedBuilder,
    PreHook,
    ReactionPaginator,
} from '@utilly/framework';
import { secondsToString } from '@utilly/utils';
import {
    DEFAULT_NOTIFICATION_CONSTANTS,
    EXPLICIT_LEVEL_CONSTANTS,
    REGIONS_CONSTANTS,
    VERIFICATION_LEVEL_CONSTANTS,
} from '../../constants/ServerConstants';
import type InfoCommandModule from './moduleinfo';

@Command({
    name: 'serverinfo',
    description: 'View information about a server',
    aliases: ['sinfo'],
})
@PreHook(ChannelValidatorHook({ channel: ['guild'] }))
@PreHook(
    BotPermsValidatorHook({
        permissions: ['embedLinks', 'addReactions', 'readMessageHistory'],
    })
)
export default class ServerInfo extends BaseCommand {
    parent?: InfoCommandModule;

    async execute(ctx: CommandContext): Promise<void> {
        if (!ctx.guild) return;
        const server = ctx.guild;

        const overviewPage = new EmbedBuilder();
        overviewPage.setTitle('Server Info');
        overviewPage.setDescription('**Server Overview**');
        overviewPage.addField('Server Name', server.name, true);
        overviewPage.addField('Server ID', server.id, true);
        overviewPage.addField(
            'Server Region',
            (await REGIONS_CONSTANTS(server))[server.region],
            true
        );

        overviewPage.addField(
            'Inactive Channel',
            server.afkChannelID
                ? server.channels.get(server.afkChannelID)?.mention ??
                      'No Inactive Channel'
                : 'No Inactive Channel',
            true
        );
        overviewPage.addField(
            'Inactive Timeout',
            secondsToString(server.afkTimeout),
            true
        );
        overviewPage.addField('​', '​', true);

        overviewPage.addField(
            'System Messages Channel',
            server.systemChannelID
                ? server.channels.get(server.systemChannelID)?.mention ??
                      'No System Messages'
                : 'No System Messages'
        );
        overviewPage.addField(
            'Send a random welcome message when someone joins this server.',
            server.systemChannelFlags & 1 ? 'No' : 'Yes'
        );

        overviewPage.addField(
            'Send a message when someone boosts this server.',
            server.systemChannelFlags & 2 ? 'No' : 'Yes'
        );

        overviewPage.addField(
            'Default Notification Settings',
            DEFAULT_NOTIFICATION_CONSTANTS[server.defaultNotifications],
            true
        );
        overviewPage.addField(
            'Created At',
            new Date(server.createdAt).toUTCString(),
            true
        );
        overviewPage.setFooter('Page 1/4');

        const moderationPage = new EmbedBuilder();
        moderationPage.setTitle('Server Info');
        moderationPage.setDescription('**Moderation**');
        moderationPage.addField(
            'Verification Level',
            VERIFICATION_LEVEL_CONSTANTS[server.verificationLevel]
        );
        moderationPage.addField(
            'Explicit Media Content Filter',
            EXPLICIT_LEVEL_CONSTANTS[server.explicitContentFilter]
        );
        moderationPage.addField(
            '2FA Requirement For Moderation',
            server.mfaLevel == 0 ? 'Off' : 'On'
        );
        moderationPage.setFooter('Page 2/4');

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
        const communityPage = new EmbedBuilder();
        communityPage.setTitle('Server Info');
        communityPage.setDescription('**Community**');
        if (server.rulesChannelID)
            communityPage.addField(
                'Rules Channel',
                server.channels.get(server.rulesChannelID)?.mention || '',
                true
            );

        if (server.publicUpdatesChannelID)
            communityPage.addField(
                'Community Updates Channel',
                server.channels.get(server.publicUpdatesChannelID)?.mention ||
                    '',
                true
            );

        if (server.maxMembers)
            communityPage.addField(
                'Max Members',
                server.maxMembers.toString(),
                true
            );

        if (server.maxVideoChannelUsers)
            communityPage.addField(
                'Max Video Channel Users',
                server.maxVideoChannelUsers.toString(),
                true
            );

        if (server.description)
            communityPage.addField('Description', server.description, true);
        if (server.bannerURL) communityPage.setImage(server.bannerURL);
        if (server.iconURL) communityPage.setThumbnail(server.iconURL);
        communityPage.setFooter('Page 3/4');

        const otherPage = new EmbedBuilder();
        otherPage.setTitle('Server Info');
        otherPage.setDescription('**Other Info**');
        otherPage.addField('Member Count', server.memberCount.toString(), true);
        otherPage.addField(
            'Owner',
            ctx.guild?.members.get(server.ownerID)?.mention || 'Not found',
            true
        );
        otherPage.setFooter('Page 4/4');

        const reply = await ctx.reply({ embed: overviewPage });

        this.bot.reactionWaitHandler.addCollector(
            new ReactionPaginator(reply, ctx.message.author.id, [
                { embed: overviewPage },
                { embed: moderationPage },
                { embed: communityPage },
                { embed: otherPage },
            ])
        );
    }
}

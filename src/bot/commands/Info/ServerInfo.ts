import { GuildChannel, Message } from 'eris';
import Command from '../../framework/handlers/CommandHandler/Command';
import { secondsToString } from '../../framework/utilities/DurationParser';
import EmbedBuilder from '../../framework/utilities/EmbedBuilder';
import UtillyClient from '../../UtillyClient';
import InfoCommandModule from './moduleinfo';

export default class ServerInfo extends Command {
    parent?: InfoCommandModule;

    constructor(bot: UtillyClient, parent: InfoCommandModule) {
        super(bot, parent);
        this.help.name = 'serverinfo';
        this.help.description = 'View information about a server';
        this.help.usage = '';
        this.help.aliases = ['sinfo'];
        this.settings.guildOnly = true;
        this.settings.botPerms = ['embedLinks'];
    }

    async execute(message: Message): Promise<void> {
        if (!(message.channel instanceof GuildChannel)) return;
        const server = message.channel.guild;
        const embed = new EmbedBuilder();
        embed.setTitle('Server Info');
        embed.addField('Name', server.name, true);
        if (server.afkChannelID)
            embed.addField(
                'AFK',
                `**Channel**: ${
                    server.channels.get(server.afkChannelID)?.mention
                }\n**Timeout**: ${secondsToString(server.afkTimeout)}`,
                true
            );
        embed.addField('ID', server.id, true);
        embed.addField(
            'Created At',
            new Date(server.createdAt).toUTCString(),
            true
        );
        embed.addField('Member Count', server.memberCount.toString(), true);
        embed.addField('Region', server.region, true);

        if (server.maxMembers)
            embed.addField('Max Members', server.maxMembers.toString(), true);

        if (server.maxVideoChannelUsers)
            embed.addField(
                'Max Video Channel Users',
                server.maxVideoChannelUsers.toString(),
                true
            );

        if (server.publicUpdatesChannelID)
            embed.addField(
                'Community Updates Channel',
                server.channels.get(server.publicUpdatesChannelID)?.mention ||
                    '',
                true
            );
        if (server.systemChannelID)
            embed.addField(
                'System Messages Channel',
                server.channels.get(server.systemChannelID)?.mention || '',
                true
            );
        if (server.rulesChannelID)
            embed.addField(
                'Rules Channel',
                server.channels.get(server.rulesChannelID)?.mention || '',
                true
            );

        if (server.description)
            embed.addField('Description', server.description);
        if (server.bannerURL) embed.setImage(server.bannerURL);
        if (server.iconURL) embed.setThumbnail(server.iconURL);

        message.channel.createMessage({ embed });
    }
}

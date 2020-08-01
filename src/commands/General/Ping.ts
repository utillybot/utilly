import { GuildChannel, Message } from 'eris';
import UtillyClient from '../../bot';
import Command from '../../handlers/CommandHandler/Command/Command';
import EmbedBuilder from '../../helpers/Embed';
import GeneralCommandModule from './moduleinfo';

export default class Ping extends Command {
    parent?: GeneralCommandModule;

    constructor(bot: UtillyClient) {
        super(bot);
        this.help.name = 'ping';
        this.help.description = "Checks the bot's ping";
        this.help.usage = '';
        this.settings.guildOnly = true;
    }

    async execute(bot: UtillyClient, message: Message): Promise<void> {
        if (message.channel instanceof GuildChannel) {
            const ZWS = '​';
            const m = await message.channel.createMessage(ZWS);
            const embed = new EmbedBuilder();
            embed.setTitle('Bot Ping');
            embed.addField(
                'Shard Latency (Server)',
                `${message.channel.guild.shard.latency.toString()}ms`,
                true
            );
            embed.addField(
                'Bot Latency (Client)',
                `${m.timestamp - message.timestamp}ms`,
                true
            );
            if (message.member != undefined) {
                embed.addField(
                    'Shard Id',
                    message.member.guild.shard.id.toString(),
                    true
                );
            }
            embed.setTimestamp();
            embed.setFooter(
                `Requested by ${message.author.username}#${message.author.discriminator}`,
                message.author.avatarURL
            );

            m.edit({ content: '', embed });
        }
    }
}

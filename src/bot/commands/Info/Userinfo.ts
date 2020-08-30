import { GuildChannel, Member, Message, User } from 'eris';
import Command from '../../framework/handlers/CommandHandler/Command';
import EmbedBuilder from '../../framework/utilities/EmbedBuilder';
import UtillyClient from '../../UtillyClient';
import InfoCommandModule from './moduleinfo';

export default class Userinfo extends Command {
    parent?: InfoCommandModule;

    constructor(bot: UtillyClient, parent: InfoCommandModule) {
        super(bot, parent);
        this.help.name = 'userinfo';
        this.help.description = 'View information about yourself';
        this.help.usage = '';
        this.help.aliases = ['uinfo'];
        this.settings.guildOnly = false;
        this.settings.botPerms = ['embedLinks'];
    }

    async execute(message: Message): Promise<void> {
        let member: Member | null = null;
        let user: User | null = null;

        if (message.channel instanceof GuildChannel) {
            member = message.member;
        } else {
            user = message.author;
        }

        const embed = new EmbedBuilder();
        embed.setTitle('User Info');
        if (user != null) {
            embed.addField('Username', user.username, true);
            embed.addField('Discriminator', user.discriminator, true);
            embed.addField('Bot', user.bot ? 'Yes' : 'No', true);
            embed.addField('Mention', user.mention, true);
            embed.addField('ID', user.id, true);
            embed.addField(
                'Created At',
                new Date(user.createdAt).toUTCString()
            );
            embed.setThumbnail(user.dynamicAvatarURL('png', 1024));
        } else if (member != null) {
            embed.addField('Username', member.username, true);
            if (member.nick) embed.addField('Nickname', member.nick, true);
            embed.addField('Discriminator', member.discriminator, true);
            embed.addField('Bot', member.bot ? 'Yes' : 'No', true);
            embed.addField('Mention', member.mention, true);
            embed.addField('ID', member.id, true);
            embed.addField(
                'Created At',
                new Date(member.createdAt).toUTCString()
            );
            embed.addField(
                'Joined At',
                new Date(member.joinedAt).toUTCString()
            );
            embed.setThumbnail(member.user.dynamicAvatarURL('png', 1024));
        }

        message.channel.createMessage({ embed });
    }
}

import type { CommandContext, UtillyClient } from '@utilly/framework';
import { BaseCommand, EmbedBuilder } from '@utilly/framework';
import type { Member, User } from 'eris';
import type InfoCommandModule from './moduleinfo';

export default class Userinfo extends BaseCommand {
    parent?: InfoCommandModule;

    constructor(bot: UtillyClient, parent: InfoCommandModule) {
        super(bot, parent);
        this.help.name = 'userinfo';
        this.help.description = 'View information about yourself';
        this.help.usage = '';
        this.help.aliases = ['uinfo'];
        this.settings.guildOnly = false;
        this.permissions.botPerms = ['embedLinks'];
    }

    async execute(ctx: CommandContext): Promise<void> {
        let member: Member | undefined;
        let user: User | null = null;

        if (ctx.guild) {
            member = ctx.member;
        } else {
            user = ctx.message.author;
        }

        const embed = new EmbedBuilder();
        embed.setTitle('User Info');
        if (user) {
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
        } else if (member) {
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

        ctx.reply({ embed });
    }
}

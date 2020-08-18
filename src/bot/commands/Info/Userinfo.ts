import { GuildChannel, Member, Message, User } from 'eris';
import Command from '../../framework/handlers/CommandHandler/Command/Command';
import EmbedBuilder from '../../framework/utilities/EmbedBuilder';
import UtillyClient from '../../UtillyClient';
import InfoCommandModule from './moduleinfo';

export default class Userinfo extends Command {
    parent?: InfoCommandModule;

    constructor(bot: UtillyClient, parent: InfoCommandModule) {
        super(bot, parent);
        this.help.name = 'userinfo';
        this.help.description = 'View information about a user';
        this.help.usage = '(username/user id/user mention)';
        this.help.aliases = ['uinfo'];
        this.settings.guildOnly = false;
    }

    async execute(message: Message, args: string[]): Promise<void> {
        let user: User | undefined;
        let member: Member | undefined;
        const regex = /<@!?(\d{18})>/;

        if (args.length == 0) {
            member = message.member;
        } else {
            const entity = args[0];
            const matched = entity.match(regex);
            let foundUser;
            if (message.channel instanceof GuildChannel) {
                foundUser = message.channel.guild.members.find(
                    member =>
                        member.username.toLowerCase() ==
                        args.join(' ').toLowerCase()
                );
            }
            // 1. Check by user ID, 2. Check by mention, 3. Check by name
            if (
                message.channel instanceof GuildChannel &&
                message.channel.guild.members.has(entity)
            ) {
                member = message.channel.guild.members.get(entity);
            } else if (this.bot.users.has(entity)) {
                user = this.bot.users.get(entity);
            } else if (
                matched != null &&
                ((message.channel instanceof GuildChannel &&
                    message.channel.guild.members.has(matched[1])) ||
                    this.bot.users.has(matched[1]))
            ) {
                if (
                    message.channel instanceof GuildChannel &&
                    message.channel.guild.members.has(matched[1])
                ) {
                    member = message.channel.guild.members.get(matched[1]);
                } else if (this.bot.users.has(matched[1])) {
                    user = this.bot.users.get(matched[1]);
                }
            } else if (foundUser != undefined) {
                member = foundUser;
            }

            // If nothing was found, call the REST API with user ID
            if (member == undefined && user == undefined) {
                try {
                    user = await this.bot.getRESTUser(args[0]);
                } catch {
                    user = undefined;
                }
            }
        }

        if (member == undefined && user == undefined) {
            const embed = new EmbedBuilder();
            embed.setTitle('Not Found');
            embed.setDescription(`\`${args.join(' ')}\` was not found`);
            message.channel.createMessage({ embed });
            return;
        }
        const embed = new EmbedBuilder();
        embed.setTitle('User Info');
        if (user != undefined) {
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
        } else if (member != undefined) {
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

import { GuildChannel, Message } from 'eris';
import UtillyClient from '../../bot';
import CommandModule from '../../handlers/CommandHandler/CommandModule/CommandModule';

export default class SettingsCommandModule extends CommandModule {
    constructor() {
        super();
        this.info.name = 'Settings';
        this.info.description = 'Modify settings for all modules.';
    }

    async checkPermission(
        bot: UtillyClient,
        message: Message
    ): Promise<boolean> {
        if (message.channel instanceof GuildChannel) {
            if (message.author.id == message.channel.guild.ownerID) return true;
            if (
                message.member &&
                message.member.permission.has('administrator')
            )
                return true;
        }
        return false;
    }
}

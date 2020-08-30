import { GuildChannel, Message } from 'eris';
import CommandModule from '../../../framework/handlers/CommandHandler/CommandModule';
import UtillyClient from '../../UtillyClient';

export default class SettingsCommandModule extends CommandModule {
    constructor(bot: UtillyClient) {
        super(bot);
        this.info.name = 'Settings';
        this.info.description = 'Modify settings for all modules.';
    }

    async checkPermission(message: Message): Promise<boolean> {
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

import { Message } from 'eris';
import Command from '../../framework/handlers/CommandHandler/Command/Command';
import UtillyClient from '../../UtillyClient';
import SettingsCommandModule from './moduleinfo';

export default class Settings extends Command {
    constructor(bot: UtillyClient, parent: SettingsCommandModule) {
        super(bot, parent);
        this.help.name = 'settings';
        this.help.description = 'Modify a setting for this guild';
        this.help.usage = 'settings';
        this.settings.guildOnly = true;
    }

    async execute(message: Message): Promise<void> {
        message.channel.createMessage('test');
    }
}

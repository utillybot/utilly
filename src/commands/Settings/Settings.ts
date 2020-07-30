import { Message } from 'eris';
import UtillyClient from '../../bot';
import Command from '../../handlers/CommandHandler/Command/Command';

export default class Settings extends Command {
    constructor(bot: UtillyClient) {
        super(bot);
        this.help.name = 'settings';
        this.help.description = 'Modify a setting for this guild';
        this.help.usage = 'settings';
        this.settings.guildOnly = true;
    }

    async execute(_bot: UtillyClient, message: Message): Promise<void> {
        message.channel.createMessage('test');
    }
}

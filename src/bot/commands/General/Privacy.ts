import { Message } from 'eris';
import Command from '../../framework/handlers/CommandHandler/Command';
import EmbedBuilder from '../../framework/utilities/EmbedBuilder';
import UtillyClient from '../../UtillyClient';
import GeneralCommandModule from './moduleinfo';

export default class Privacy extends Command {
    parent?: GeneralCommandModule;

    constructor(bot: UtillyClient, parent: GeneralCommandModule) {
        super(bot, parent);
        this.help.name = 'privacy';
        this.help.description = "Shows the bot's privacy policy";
        this.help.usage = '';
        this.settings.guildOnly = true;
        this.settings.botPerms = ['embedLinks'];
    }

    async execute(message: Message): Promise<void> {
        const embed = new EmbedBuilder();
        embed.setTitle('Privacy Policy');
        embed.setDescription(
            'By using the bot you agree to the following terms:\n* Obviously the discord TOS\n* In any server the bot is in, the **guild id** along with any settings you set (including enabled and disabled modules) will be stored in a database.'
        );
        message.channel.createMessage({ embed });
    }
}

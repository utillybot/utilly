import { GuildTextableChannel, Message } from 'eris';
import UtillyClient from '../../bot';
import Command from '../../handlers/CommandHandler/Command/Command';
import EmbedBuilder from '../../helpers/Embed';
import LoggingCommandModule from './moduleinfo';

export default class Logsettings extends Command {
    parent?: LoggingCommandModule;

    constructor(bot: UtillyClient) {
        super(bot);
        this.help.name = 'logsettings';
        this.help.description = 'Modify settings for the logging plugin';
        this.help.usage = '';
    }

    async execute(
        bot: UtillyClient,
        message: Message<GuildTextableChannel>,
        args: string[]
    ): Promise<void> {
        const embed = new EmbedBuilder();
        embed.setTitle('Logging Settings');
        embed.setDescription(
            'React to the message to choose which type of settings you want to modify.'
        );
    }
}

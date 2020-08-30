import {
    Command,
    CommandContext,
} from '../../framework/handlers/CommandHandler/Command';
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

    async execute(ctx: CommandContext): Promise<void> {
        const embed = new EmbedBuilder();
        embed.setTitle('Privacy Policy');
        embed.setDescription(
            'We collect the guild ids and the settings you set for that guild. For example, this would be whether a modules is enabled or not or channel ids for the log channels. The data will only be used to store your preferences and settings for you guild and not anything else. The data is stored in a database that I, jtsshieh#6424, and my hosting provider have access to. If you have any concerns or want your data removed, send me a DM and I will remove your guild settings. '
        );
        ctx.reply({ embed });
    }
}

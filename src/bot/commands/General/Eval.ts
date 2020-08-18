import UtillyClient from '../../UtillyClient';
import GeneralCommandModule from './moduleinfo';
import Command from '../../framework/handlers/CommandHandler/Command/Command';
import { Message } from 'eris';
import EmbedBuilder from '../../framework/utilities/EmbedBuilder';

export default class Eval extends Command {
    parent!: GeneralCommandModule;

    constructor(bot: UtillyClient, parent: GeneralCommandModule) {
        super(bot, parent);
        this.help.name = 'eval';
        this.help.description =
            'View all the modules, or commands in a specific module';
        this.help.usage = '(command/module)';
        this.settings.guildOnly = true;
    }

    async checkPermission(message: Message): Promise<boolean> {
        return message.author.id == '236279900728721409';
    }

    async execute(message: Message, args: string[]): Promise<void> {
        const code = args.join(' ');

        let evaled;
        let remove;

        //Attempt to eval code
        try {
            //Remove all discord things
            remove = (text: string) => {
                if (typeof text === 'string')
                    return text
                        .replace(/`/g, '`' + String.fromCharCode(8203))
                        .replace(/@/g, '@' + String.fromCharCode(8203));
                else return text;
            };

            //Eval the code and set the result
            evaled = eval(code);

            //If it is a string, inspect it
            if (typeof evaled !== 'string')
                evaled = (await import('util')).default.inspect(evaled);
        } catch (err) {
            //If eval has failed setup new embed
            const embed = new EmbedBuilder()
                .setAuthor('Eval Error')
                .setDescription("Eval's result")
                .addField(
                    ':inbox_tray: Input:',
                    `\`\`\`js\n${code}\n\`\`\``,
                    false
                )
                .addField(
                    ':outbox_tray: Output:',
                    `\`\`\`${err.stack}\`\`\``,
                    false
                )
                .setColor(0xff0000)
                .setFooter('Eval', this.bot.user.avatarURL)
                .setTimestamp();
            //Send the embed
            message.channel.createMessage({
                embed,
            });
            return;
        }

        //Attempt to build the embeds
        try {
            //Build the success embed
            const embed = new EmbedBuilder()
                .setAuthor('Eval Success')
                .setDescription("Eval's result")
                .addField(
                    ':inbox_tray: Input:',
                    `\`\`\`js\n${code}\n\`\`\``,
                    false
                )
                .addField(
                    ':outbox_tray: Output:',
                    `\`\`\`js\n${remove(evaled)}\n\`\`\``,
                    false
                )
                .setColor(0x00afff)
                .setFooter('Eval', this.bot.user.avatarURL)
                .setTimestamp();

            //Send the embed
            message.channel.createMessage({
                embed,
            });
        } catch (err) {
            //If failed, build the failure embed
            const embed = new EmbedBuilder()
                .setAuthor('Eval Error')
                .setDescription("Eval's result")
                .addField(
                    ':inbox_tray: Input:',
                    `\`\`\`js\n${code}\n\`\`\``,
                    false
                )
                .addField(
                    ':outbox_tray: Output:',
                    `\`\`\`${err.stack}\`\`\``,
                    false
                )
                .setColor(0xff0000)
                .setFooter('Eval', this.bot.user.avatarURL)
                .setTimestamp();

            //And send it
            message.channel.createMessage({
                embed,
            });
        }
    }
}
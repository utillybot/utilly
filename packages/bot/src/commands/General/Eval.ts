import type { CommandContext, UtillyClient } from '@utilly/framework';
import { BaseCommand, EmbedBuilder } from '@utilly/framework';
import axios from 'axios';
import type GeneralCommandModule from './moduleinfo';

export default class Eval extends BaseCommand {
    parent!: GeneralCommandModule;

    constructor(bot: UtillyClient, parent: GeneralCommandModule) {
        super(bot, parent);
        this.help.name = 'eval';
        this.help.description =
            'View all the modules, or commands in a specific module';
        this.help.usage = '(command/module)';
        this.settings.guildOnly = true;

        this.permissions.userIDs = ['236279900728721409'];
    }

    async execute(ctx: CommandContext): Promise<void> {
        const code = ctx.args.join(' ');

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
            evaled = await eval(code);

            //If it is a string, inspect it
            if (typeof evaled !== 'string')
                evaled = (await import('util')).default.inspect(evaled);

            //Build the success embed
            const embed = new EmbedBuilder()
                .setAuthor('Eval Success')
                .setDescription("Eval's result")
                .addField(
                    ':inbox_tray: Input:',
                    `\`\`\`js\n${code}\n\`\`\``,
                    false
                )
                .setColor(0x00afff)
                .setFooter('Eval', this.bot.user.avatarURL)
                .setTimestamp();

            if (evaled.toString().length > 1024) {
                const result = await axios.post(
                    'https://hasteb.in/documents',
                    evaled,
                    { headers: { 'content-type': 'application/json' } }
                );
                embed.addField(
                    ':outbox_tray: Output:',
                    `[Output](https://hasteb.in/${result.data.key})`,
                    false
                );
            } else {
                embed.addField(
                    ':outbox_tray: Output:',
                    `\`\`\`js\n${remove(evaled)}\n\`\`\``,
                    false
                );
            }

            //Send the embed
            ctx.reply({
                embed,
            });
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
            ctx.reply({
                embed,
            });
            return;
        }
    }
}

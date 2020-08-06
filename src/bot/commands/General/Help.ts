import { GuildChannel, Message } from 'eris';
import { getCustomRepository } from 'typeorm';
import { Guild } from '../../../database/entity/Guild';
import GuildRepository from '../../../database/repository/GuildRepository';
import { ModuleConstants, Modules } from '../../constants/ModuleConstants';
import Command from '../../handlers/CommandHandler/Command/Command';
import DatabaseModule from '../../handlers/ModuleHandler/Module/DatabaseModule';
import EmbedBuilder from '../../utilities/EmbedBuilder';
import UtillyClient from '../../UtillyClient';
import GeneralCommandModule from './moduleinfo';

export default class Help extends Command {
    parent?: GeneralCommandModule;

    constructor(bot: UtillyClient) {
        super(bot);
        this.help.name = 'help';
        this.help.description =
            'View all the modules, or commands in a specific module';
        this.help.usage = '(command/module)';
        this.help.aliases = ['h'];
        this.settings.guildOnly = true;
    }

    async execute(message: Message, args: string[]): Promise<void> {
        if (message.channel instanceof GuildChannel) {
            const guildRow = await getCustomRepository(
                GuildRepository
            ).selectOrCreate(message.channel.guild.id, Modules);

            if (args.length == 0) {
                this.handleBaseCommand(message, guildRow);
            } else {
                const item = args[0].toLowerCase();
                if (this.bot.CommandHandler.commandModules.has(item)) {
                    this.handleModule(message, item, guildRow);
                } else if (
                    this.bot.CommandHandler.commands.has(item) ||
                    this.bot.CommandHandler.aliases.has(item)
                ) {
                    this.handleCommand(message, item, guildRow);
                }
            }
        }
    }

    handleBaseCommand(message: Message, guildRow: Guild): void {
        const embed = new EmbedBuilder();
        embed.setTitle('Help');

        let enabledModules = '';
        let disabledModules = '';

        for (const [, module] of this.bot.CommandHandler.commandModules) {
            if (module.parent instanceof DatabaseModule) {
                if (!guildRow[module.parent.databaseEntry]) {
                    disabledModules += module.info.name + '\n';
                } else {
                    enabledModules += module.info.name + '\n';
                }
            } else {
                enabledModules += module.info.name + '\n';
            }
        }

        embed.addField(
            'Enabled Modules',
            enabledModules != '' ? enabledModules : '**none**',
            true
        );
        embed.addField(
            'Disabled Modules',
            disabledModules != '' ? disabledModules : '**none**',
            true
        );
        embed.addField(
            'Help',
            `To view help for a specific module, type \`${
                guildRow.prefix ? guildRow.prefix[0] : 'u!'
            }help module\` where module is the name of the module.`
        );
        embed.addField(
            'Module Management',
            `To enable or disable modules use the \`${
                guildRow.prefix ? guildRow.prefix[0] : 'u!'
            }module enable module\` where the second module is the name of the module you want to enable.`
        );
        embed.setTimestamp();
        embed.setFooter(
            `Requested by ${message.author.username}#${message.author.discriminator}`,
            message.author.avatarURL
        );
        message.channel.createMessage({ embed });
    }

    handleModule(message: Message, item: string, guildRow: Guild): void {
        const embed = new EmbedBuilder();
        embed.setTitle(
            `Help for \`${item}\` module : ${
                guildRow[item] == false ? 'Disabled' : 'Enabled'
            }`
        );
        embed.setColor(guildRow[item] == false ? 0xff0000 : 0x00ff00);
        embed.setDescription(ModuleConstants[item]);

        for (const [, command] of this.bot.CommandHandler.commands) {
            if (command.parent == undefined)
                throw new Error('Injection failure');
            if (command.parent.info.name.toLowerCase() != item) continue;
            embed.addField(
                `\`${guildRow.prefix ? guildRow.prefix[0] : 'u!'}${
                    command.help.name
                }${command.help.usage ? ' ' + command.help.usage : ''}\``,
                command.help.description
            );
        }
        embed.setTimestamp();
        embed.setFooter(
            `Requested by ${message.author.username}#${message.author.discriminator}`,
            message.author.avatarURL
        );
        message.channel.createMessage({ embed });
    }

    handleCommand(message: Message, item: string, guildRow: Guild): void {
        const embed = new EmbedBuilder();

        let command = this.bot.CommandHandler.commands.get(item);
        if (!command) command = this.bot.CommandHandler.aliases.get(item);
        if (!command) return;

        if (command.parent == undefined) throw new Error('Injection failure');

        embed.setTitle(`Help for \`${command.help.name}\` command`);

        embed.setDescription(command.help.description);
        if (command.help.usage != '')
            embed.addField(
                'Usage',
                `${guildRow.prefix ? guildRow.prefix[0] : 'u!'}${
                    command.help.name
                } ${command.help.usage}`,
                true
            );
        const aliases = [];
        for (const alias of command.help.aliases) {
            aliases.push((guildRow.prefix ? guildRow.prefix[0] : 'u!') + alias);
        }
        if (aliases.length != 0)
            embed.addField('Aliases', aliases.join(', '), true);

        embed.addField(
            'Guild Only',
            command.settings.guildOnly ? 'Yes' : 'No',
            true
        );

        if (command.help.permission) {
            embed.addField(
                'Permission Required',
                command.help.permission,
                true
            );
        }
        embed.addField(
            'Parent Module',
            `${command.parent.info.name} : ${
                guildRow[item] == false ? 'Disabled' : 'Enabled'
            }`
        );
        embed.setTimestamp();
        embed.setFooter(
            `Requested by ${message.author.username}#${message.author.discriminator}`,
            message.author.avatarURL
        );
        message.channel.createMessage({ embed });
    }
}

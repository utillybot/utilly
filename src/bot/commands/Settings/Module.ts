import {
    GuildChannel,
    GuildTextableChannel,
    Message,
    TextableChannel,
} from 'eris';
import { getCustomRepository, getRepository } from 'typeorm';
import Guild from '../../../database/entity/Guild';
import GuildRepository from '../../../database/repository/GuildRepository';
import { MODULES, MODULE_CONSTANTS } from '../../constants/ModuleConstants';
import Command from '../../framework/handlers/CommandHandler/Command/Command';
import { SubcommandHandler } from '../../framework/handlers/CommandHandler/SubcommandHandler';
import EmbedBuilder from '../../framework/utilities/EmbedBuilder';
import UtillyClient from '../../UtillyClient';
import SettingsCommandModule from './moduleinfo';

export default class Module extends Command {
    subCommandHandler: SubcommandHandler;

    constructor(bot: UtillyClient, parent: SettingsCommandModule) {
        super(bot, parent);
        this.help.name = 'module';
        this.help.description = 'Enable, disable, or view info about a module.';
        this.help.usage = '(enable, disable, toggle, info) (module name)';

        this.settings.guildOnly = true;
        this.settings.botPerms = ['embedLinks'];

        this.subCommandHandler = new SubcommandHandler(bot.logger);

        this.subCommandHandler.registerSubcommand('enable', this.enable);
        this.subCommandHandler.registerSubcommand('disable', this.disable);
        this.subCommandHandler.registerSubcommand('toggle', this.toggle);
        this.subCommandHandler.registerSubcommand('info', this.info);

        this.subCommandHandler.registerPrecheck(this.precheck);
    }

    async execute(
        message: Message<GuildTextableChannel>,
        args: string[]
    ): Promise<void> {
        if (!(await this.subCommandHandler.handle(message, args))) {
            if (args.length == 0) {
                const embed = new EmbedBuilder();
                embed.setTitle('Enable, disable, or view info about a module');
                return;
            } else if (args.length == 1) {
                if (!(await this.precheck(message, args))) return;
                this.toggle(message, args);
            }
        }
    }

    async enable(
        message: Message<TextableChannel>,
        args: string[]
    ): Promise<void> {
        const module = args[0].toLowerCase();
        if (!(message.channel instanceof GuildChannel)) return;
        const guildRow = await getCustomRepository(
            GuildRepository
        ).selectOrCreate(message.channel.guild.id, [module]);

        const embed = new EmbedBuilder();
        embed.setTimestamp();
        embed.setFooter(
            `Requested by ${message.author.username}#${message.author.discriminator}`,
            message.author.avatarURL
        );

        if (guildRow[module]) {
            embed.setTitle('Module already enabled');
            embed.setDescription(
                `The module \`${module}\` is already enabled.`
            );
            embed.setColor(0xff0000);
        } else {
            guildRow[module] = true;
            getRepository(Guild).update(message.channel.guild.id, guildRow);

            embed.setTitle('Module Enabled');
            embed.setDescription(`The module \`${module}\` has been enabled.`);
            embed.setColor(0x00ff00);
        }
        message.channel.createMessage({ embed });
    }

    async disable(
        message: Message<TextableChannel>,
        args: string[]
    ): Promise<void> {
        const module = args[0].toLowerCase();
        if (!(message.channel instanceof GuildChannel)) return;
        const guildRow = await getCustomRepository(
            GuildRepository
        ).selectOrCreate(message.channel.guild.id, [module]);

        const embed = new EmbedBuilder();
        embed.setTimestamp();
        embed.setFooter(
            `Requested by ${message.author.username}#${message.author.discriminator}`,
            message.author.avatarURL
        );

        if (!guildRow[module]) {
            embed.setTitle('Module already disabled');
            embed.setDescription(
                `The module \`${module}\` is already disabled.`
            );
            embed.setColor(0xff0000);
        } else {
            guildRow[module] = false;
            getRepository(Guild).update(message.channel.guild.id, guildRow);

            embed.setTitle('Module Disabled');
            embed.setDescription(`The module \`${module}\` has been disabled.`);
            embed.setColor(0x00ff00);
        }
        message.channel.createMessage({ embed });
    }

    async toggle(
        message: Message<TextableChannel>,
        args: string[]
    ): Promise<void> {
        const module = args[0].toLowerCase();
        if (!(message.channel instanceof GuildChannel)) return;
        const guildRow = await getCustomRepository(
            GuildRepository
        ).selectOrCreate(message.channel.guild.id, [module]);

        const embed = new EmbedBuilder();
        embed.setTimestamp();
        embed.setFooter(
            `Requested by ${message.author.username}#${message.author.discriminator}`,
            message.author.avatarURL
        );

        const originalModuleSetting = guildRow[module];
        if (originalModuleSetting == true) {
            guildRow[module] = false;
        } else {
            guildRow[module] = true;
        }
        const newModuleSetting = guildRow[module];
        if (originalModuleSetting == newModuleSetting) {
            embed.setTitle('Something went wrong');
            embed.setDescription(
                `The module \`${module}\` is currently ${
                    newModuleSetting ? 'enabled' : 'disabled'
                }.`
            );
            embed.setColor(0xff0000);
        } else {
            getRepository(Guild).update(message.channel.guild.id, guildRow);
            embed.setTitle(
                `Module ${newModuleSetting ? 'Enabled' : 'Disabled'}`
            );
            embed.setDescription(
                `The module \`${module}\` has been ${
                    newModuleSetting ? 'enabled' : 'disabled'
                }.`
            );
            embed.setColor(0x00ff00);
        }
        message.channel.createMessage({ embed });
    }

    async info(
        message: Message<TextableChannel>,
        args: string[]
    ): Promise<void> {
        const module = args[0].toLowerCase();
        if (!(message.channel instanceof GuildChannel)) return;
        const guildRow = await getCustomRepository(
            GuildRepository
        ).selectOrCreate(message.channel.guild.id, [module]);

        const embed = new EmbedBuilder();
        embed.setTimestamp();
        embed.setFooter(
            `Requested by ${message.author.username}#${message.author.discriminator}`,
            message.author.avatarURL
        );

        embed.setTitle('Module Info');
        embed.setDescription(MODULE_CONSTANTS[module]);
        embed.addField(
            'Status',
            `This module is **${guildRow[module] ? 'enabled' : 'disabled'}**.`
        );
        message.channel.createMessage({ embed });
    }

    async precheck(
        message: Message<TextableChannel>,
        args: string[]
    ): Promise<boolean> {
        const module = args[0] ? args[0].toLowerCase() : args[0];
        if (!module || !MODULES.includes(module)) {
            const embed = new EmbedBuilder();
            embed.setTimestamp();
            embed.setFooter(
                `Requested by ${message.author.username}#${message.author.discriminator}`,
                message.author.avatarURL
            );
            embed.setTitle(`Module ${!module ? 'not specified' : 'not found'}`);
            embed.setDescription(
                `${
                    !module
                        ? 'A module was not specified'
                        : `The module \`${module}\` was not found`
                }.`
            );
            embed.setColor(0xff0000);
            message.channel.createMessage({ embed });
            return false;
        }
        return true;
    }
}

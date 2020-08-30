import { getCustomRepository, getRepository } from 'typeorm';
import Guild from '../../../database/entity/Guild';
import GuildRepository from '../../../database/repository/GuildRepository';
import {
    BaseCommand,
    CommandContext,
} from '../../../framework/handlers/CommandHandler/Command';
import { SubcommandHandler } from '../../../framework/handlers/CommandHandler/SubcommandHandler';
import EmbedBuilder from '../../../framework/utilities/EmbedBuilder';
import { MODULES, MODULE_CONSTANTS } from '../../constants/ModuleConstants';
import UtillyClient from '../../UtillyClient';
import SettingsCommandModule from './moduleinfo';

export default class Module extends BaseCommand {
    subCommandHandler: SubcommandHandler;

    constructor(bot: UtillyClient, parent: SettingsCommandModule) {
        super(bot, parent);
        this.help.name = 'module';
        this.help.description = 'Enable, disable, or view info about a module.';
        this.help.usage = '(enable, disable, toggle, info) (module name)';

        this.settings.guildOnly = true;
        this.permissions.botPerms = ['embedLinks'];
        this.permissions.userPerms = ['manageGuild'];
        this.subCommandHandler = new SubcommandHandler(bot.logger);

        this.subCommandHandler.registerSubcommand('enable', {
            description: 'Enable a module.',
            usage: '(module name)',
            execute: this.enable,
        });
        this.subCommandHandler.registerSubcommand('disable', {
            description: 'Disable a module.',
            usage: '(module name)',
            execute: this.disable,
        });
        this.subCommandHandler.registerSubcommand('toggle', {
            description: 'Toggle a module.',
            usage: '(module name)',
            execute: this.toggle,
        });
        this.subCommandHandler.registerSubcommand('info', {
            description: 'View info about a module.',
            usage: '(module name)',
            execute: this.info,
        });

        this.subCommandHandler.registerPrecheck(this.precheck);
    }

    async execute(ctx: CommandContext): Promise<void> {
        if (!(await this.subCommandHandler.handle(ctx))) {
            if (ctx.args.length == 0) {
                ctx.reply({
                    embed: await this.subCommandHandler.generateHelp(
                        this,
                        ctx.message
                    ),
                });
            } else if (ctx.args.length == 1) {
                if (!(await this.precheck(ctx))) return;
                this.toggle(ctx);
            }
        }
    }

    async enable(ctx: CommandContext): Promise<void> {
        const module = ctx.args[0].toLowerCase();
        if (!ctx.guild) return;
        const guildRow = await getCustomRepository(
            GuildRepository
        ).selectOrCreate(ctx.guild.id, [module]);

        const embed = new EmbedBuilder();
        embed.addDefaults(ctx.message.author);

        if (guildRow[module]) {
            embed.setTitle('Module already enabled');
            embed.setDescription(
                `The module \`${module}\` is already enabled.`
            );
            embed.setColor(0xff0000);
        } else {
            guildRow[module] = true;
            getRepository(Guild).update(ctx.guild.id, guildRow);

            embed.setTitle('Module Enabled');
            embed.setDescription(`The module \`${module}\` has been enabled.`);
            embed.setColor(0x00ff00);
        }
        ctx.reply({ embed });
    }

    async disable(ctx: CommandContext): Promise<void> {
        const module = ctx.args[0].toLowerCase();
        if (!ctx.guild) return;
        const guildRow = await getCustomRepository(
            GuildRepository
        ).selectOrCreate(ctx.guild.id, [module]);

        const embed = new EmbedBuilder();
        embed.addDefaults(ctx.message.author);

        if (!guildRow[module]) {
            embed.setTitle('Module already disabled');
            embed.setDescription(
                `The module \`${module}\` is already disabled.`
            );
            embed.setColor(0xff0000);
        } else {
            guildRow[module] = false;
            getRepository(Guild).update(ctx.guild.id, guildRow);

            embed.setTitle('Module Disabled');
            embed.setDescription(`The module \`${module}\` has been disabled.`);
            embed.setColor(0x00ff00);
        }
        ctx.reply({ embed });
    }

    async toggle(ctx: CommandContext): Promise<void> {
        const module = ctx.args[0].toLowerCase();
        if (!ctx.guild) return;
        const guildRow = await getCustomRepository(
            GuildRepository
        ).selectOrCreate(ctx.guild.id, [module]);

        const embed = new EmbedBuilder();
        embed.addDefaults(ctx.message.author);

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
            getRepository(Guild).update(ctx.guild.id, guildRow);
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
        ctx.reply({ embed });
    }

    async info(ctx: CommandContext): Promise<void> {
        const module = ctx.args[0].toLowerCase();
        if (!ctx.guild) return;
        const guildRow = await getCustomRepository(
            GuildRepository
        ).selectOrCreate(ctx.guild.id, [module]);

        const embed = new EmbedBuilder();
        embed.addDefaults(ctx.message.author);

        embed.setTitle('Module Info');
        embed.setDescription(MODULE_CONSTANTS[module]);
        embed.addField(
            'Status',
            `This module is **${guildRow[module] ? 'enabled' : 'disabled'}**.`
        );
        ctx.reply({ embed });
    }

    async precheck(ctx: CommandContext): Promise<boolean> {
        const module = ctx.args[0] ? ctx.args[0].toLowerCase() : ctx.args[0];
        if (!module || !MODULES.includes(module)) {
            const embed = new EmbedBuilder();
            embed.addDefaults(ctx.message.author);

            embed.setTitle(`Module ${!module ? 'not specified' : 'not found'}`);
            embed.setDescription(
                `${
                    !module
                        ? 'A module was not specified'
                        : `The module \`${module}\` was not found`
                }.`
            );
            embed.setColor(0xff0000);
            ctx.reply({ embed });
            return false;
        }
        return true;
    }
}

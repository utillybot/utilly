import { Guild, GuildRepository } from '@utilly/database';
import type { CommandContext, UtillyClient } from '@utilly/framework';
import {
    BaseCommand,
    BotPermsValidatorHook,
    ChannelValidatorHook,
    EmbedBuilder,
    Subcommand,
    SubcommandHandler,
    UserPermsValidatorHook,
} from '@utilly/framework';
import { MODULES, MODULE_CONSTANTS } from '../../constants/ModuleConstants';
import type SettingsCommandModule from './moduleinfo';
import type {
    CommandHookContext,
    CommandHookNext,
} from '@utilly/framework/dist/handlers/CommandHandler/CommandHook';
import {
    CommandHook,
    runCommandHooks,
} from '@utilly/framework/dist/handlers/CommandHandler/CommandHook';

export default class Module extends BaseCommand {
    subCommandHandler: SubcommandHandler;

    constructor(bot: UtillyClient, parent: SettingsCommandModule) {
        super(bot, parent);
        this.help.name = 'module';
        this.help.description = 'Enable, disable, or view info about a module.';
        this.help.usage = '(enable, disable, toggle, info) (module name)';

        this.preHooks.push(
            new ChannelValidatorHook({
                channel: ['guild'],
            }),
            new BotPermsValidatorHook({
                permissions: ['embedLinks'],
            }),
            new UserPermsValidatorHook({
                permissions: ['manageGuild'],
            })
        );
        this.subCommandHandler = new SubcommandHandler(bot.logger, bot);

        this.subCommandHandler.registerSubcommand(new ModuleEnable(this.bot));
        this.subCommandHandler.registerSubcommand(new ModuleDisable(this.bot));
        this.subCommandHandler.registerSubcommand(new ModuleToggle(this.bot));
        this.subCommandHandler.registerSubcommand(new ModuleInfo(this.bot));

        this.subCommandHandler.preHooks.push(new ModuleSubcommandHook());
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
                if (
                    !(await runCommandHooks(
                        { bot: this.bot, message: ctx.message, args: ctx.args },
                        [new ModuleSubcommandHook()]
                    ))
                )
                    return;
                this.subCommandHandler.getCommand('toggle')!.execute(ctx);
            }
        }
    }
}

class ModuleSubcommandHook extends CommandHook {
    async execute(
        ctx: CommandHookContext,
        next: CommandHookNext
    ): Promise<void> {
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
            ctx.message.channel.createMessage({ embed });
            return;
        }
        next();
    }
}

class ModuleEnable extends Subcommand {
    constructor(bot: UtillyClient) {
        super(bot);

        this.help.name = 'enable';
        this.help.description = 'Enable a module.';
        this.help.usage = '(module name)';
    }

    async execute(ctx: CommandContext): Promise<void> {
        const module = ctx.args[0].toLowerCase();
        if (!ctx.guild) return;
        const guildRow = await this.bot.database.connection
            .getCustomRepository(GuildRepository)
            .selectOrCreate(ctx.guild.id, [module]);

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
            this.bot.database.connection
                .getRepository(Guild)
                .update(ctx.guild.id, guildRow);

            embed.setTitle('Module Enabled');
            embed.setDescription(`The module \`${module}\` has been enabled.`);
            embed.setColor(0x00ff00);
        }
        ctx.reply({ embed });
    }
}

class ModuleDisable extends Subcommand {
    constructor(bot: UtillyClient) {
        super(bot);

        this.help.name = 'disable';
        this.help.description = 'Disable a module.';
        this.help.usage = '(module name)';
    }

    async execute(ctx: CommandContext): Promise<void> {
        const module = ctx.args[0].toLowerCase();
        if (!ctx.guild) return;
        const guildRow = await this.bot.database.connection
            .getCustomRepository(GuildRepository)
            .selectOrCreate(ctx.guild.id, [module]);

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
            this.bot.database.connection
                .getRepository(Guild)
                .update(ctx.guild.id, guildRow);

            embed.setTitle('Module Disabled');
            embed.setDescription(`The module \`${module}\` has been disabled.`);
            embed.setColor(0x00ff00);
        }
        ctx.reply({ embed });
    }
}

class ModuleToggle extends Subcommand {
    constructor(bot: UtillyClient) {
        super(bot);

        this.help.name = 'toggle';
        this.help.description = 'Toggle a module.';
        this.help.usage = '(module name)';
    }

    async execute(ctx: CommandContext): Promise<void> {
        const module = ctx.args[0].toLowerCase();
        if (!ctx.guild) return;
        const guildRow = await this.bot.database.connection
            .getCustomRepository(GuildRepository)
            .selectOrCreate(ctx.guild.id, [module]);

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
            this.bot.database.connection
                .getRepository(Guild)
                .update(ctx.guild.id, guildRow);
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
}

class ModuleInfo extends Subcommand {
    constructor(bot: UtillyClient) {
        super(bot);

        this.help.name = 'info';
        this.help.description = 'View info about a module.';
        this.help.usage = '(module name)';
    }

    async execute(ctx: CommandContext): Promise<void> {
        const module = ctx.args[0].toLowerCase();
        if (!ctx.guild) return;
        const guildRow = await this.bot.database.connection
            .getCustomRepository(GuildRepository)
            .selectOrCreate(ctx.guild.id, [module]);

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
}

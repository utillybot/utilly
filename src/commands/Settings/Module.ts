import { GuildTextableChannel, Message, TextableChannel } from 'eris';
import UtillyClient from '../../bot';
import { Guild } from '../../database/models/Guild';
import GuildOnlyCommand from '../../handlers/CommandHandler/Command/GuildOnlyCommand';
import { SubcommandHandler } from '../../handlers/CommandHandler/SubcommandHandler';
import EmbedBuilder from '../../helpers/Embed';
import { ModuleInfo, Modules } from '../../helpers/Modules';

export default class Module extends GuildOnlyCommand {
    subCommandHandler: SubcommandHandler;

    constructor(bot: UtillyClient) {
        super(bot);
        this.help.name = 'module';
        this.help.description = 'Enable, disable, or view info about a module.';
        this.help.usage = '(enable, disable, toggle, info) (module name)';

        this.subCommandHandler = new SubcommandHandler(bot.logger);

        this.subCommandHandler.registerSubcommand('enable', this.enable);
        this.subCommandHandler.registerSubcommand('disable', this.disable);
        this.subCommandHandler.registerSubcommand('toggle', this.toggle);
        this.subCommandHandler.registerSubcommand('info', this.info);

        this.subCommandHandler.registerPrecheck(this.precheck);
    }

    async execute(
        bot: UtillyClient,
        message: Message<GuildTextableChannel>,
        args: string[],
        guildRow: Guild
    ): Promise<void> {
        if (
            !(await this.subCommandHandler.handle(bot, message, args, guildRow))
        ) {
            if (args.length == 0) {
                const embed = new EmbedBuilder();
                embed.setTitle('Enable, disable, or view info about a module');
                return;
            } else if (args.length == 1) {
                if (!(await this.precheck(bot, message, args))) return;
                this.toggle(bot, message, args, guildRow);
            }
        }
    }

    async enable(
        bot: UtillyClient,
        message: Message<TextableChannel>,
        args: string[],
        guildRow?: Guild
    ): Promise<void> {
        if (guildRow == undefined) throw new Error('GuildRow undefined');
        const embed = new EmbedBuilder();
        embed.setTimestamp();
        embed.setFooter(
            `Requested by ${message.author.username}#${message.author.discriminator}`,
            message.author.avatarURL
        );
        const module = args[0].toLowerCase();

        if (guildRow.get(module)) {
            embed.setTitle('Module already enabled');
            embed.setDescription(
                `The module \`${module}\` is already enabled.`
            );
            embed.setColor(0xff0000);
        } else {
            guildRow.set(module, true);
            guildRow.save();

            embed.setTitle('Module Enabled');
            embed.setDescription(`The module \`${module}\` has been enabled.`);
            embed.setColor(0x00ff00);
        }
        message.channel.createMessage({ embed });
    }

    async disable(
        bot: UtillyClient,
        message: Message<TextableChannel>,
        args: string[],
        guildRow?: Guild
    ): Promise<void> {
        if (guildRow == undefined) throw new Error('GuildRow undefined');
        const embed = new EmbedBuilder();
        embed.setTimestamp();
        embed.setFooter(
            `Requested by ${message.author.username}#${message.author.discriminator}`,
            message.author.avatarURL
        );

        const module = args[0].toLowerCase();

        if (!guildRow.get(module)) {
            embed.setTitle('Module already disabled');
            embed.setDescription(
                `The module \`${module}\` is already disabled.`
            );
            embed.setColor(0xff0000);
        } else {
            guildRow.set(module, false);
            guildRow.save();

            embed.setTitle('Module Disabled');
            embed.setDescription(`The module \`${module}\` has been disabled.`);
            embed.setColor(0x00ff00);
        }
        message.channel.createMessage({ embed });
    }

    async toggle(
        bot: UtillyClient,
        message: Message<TextableChannel>,
        args: string[],
        guildRow?: Guild
    ): Promise<void> {
        if (guildRow == undefined) throw new Error('GuildRow undefined');
        const embed = new EmbedBuilder();
        embed.setTimestamp();
        embed.setFooter(
            `Requested by ${message.author.username}#${message.author.discriminator}`,
            message.author.avatarURL
        );

        const module = args[0].toLowerCase();

        const originalModuleSetting = guildRow.get(module);
        guildRow.toggleModule(module);
        const newModuleSetting = guildRow.get(module);
        if (originalModuleSetting == newModuleSetting) {
            embed.setTitle('Something went wrong');
            embed.setDescription(
                `The module \`${module}\` is currently ${
                    newModuleSetting ? 'enabled' : 'disabled'
                }.`
            );
            embed.setColor(0xff0000);
        } else {
            guildRow.save();
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
        bot: UtillyClient,
        message: Message<TextableChannel>,
        args: string[],
        guildRow?: Guild
    ): Promise<void> {
        if (guildRow == undefined) throw new Error('GuildRow undefined');
        const embed = new EmbedBuilder();
        embed.setTimestamp();
        embed.setFooter(
            `Requested by ${message.author.username}#${message.author.discriminator}`,
            message.author.avatarURL
        );
        const module = args[0];

        embed.setTitle('Module Info');
        embed.setDescription(ModuleInfo[module]);
        embed.addField(
            'Status',
            `This module is **${
                guildRow.get(module) ? 'enabled' : 'disabled'
            }**.`
        );
        message.channel.createMessage({ embed });
    }

    async precheck(
        bot: UtillyClient,
        message: Message<TextableChannel>,
        args: string[]
    ): Promise<boolean> {
        const module = args[0] ? args[0].toLowerCase() : args[0];
        if (!module || !Modules.includes(module)) {
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

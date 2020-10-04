import type { Database } from '@utilly/database';
import { GuildRepository } from '@utilly/database';
import type { Logger } from '@utilly/utils';
import type { Client, Message } from 'eris';
import { GuildChannel } from 'eris';
import fs from 'fs/promises';
import path from 'path';
import type { Module } from '../ModuleHandler/Module';
import type { BaseCommand } from './Command';
import { CommandContext } from './Command';
import type { CommandModule } from './CommandModule';
import type { CommandHookContext } from './CommandHook';
import { runHooks } from '../Hook';

/**
 * A handler that will handle all incoming commands to the bot
 */
export class CommandHandler {
    /**
     * A map of command aliases registered to this handler
     */
    readonly aliases: Map<string, BaseCommand>;

    /**
     * A map of command modules registered to this handler
     */
    readonly commandModules: Map<string, CommandModule>;

    /**
     * A map of the registered commands registered to this handler
     */
    readonly commands: Map<string, BaseCommand>;

    private readonly _bot: Client;

    private readonly _logger: Logger;

    private readonly _database: Database;

    /**
     * Creates a new CommandHandler
     * @param bot - the UtillyClient instance
     * @param logger - the logger
     * @param database - the database instance
     */
    constructor(bot: Client, logger: Logger, database: Database) {
        this._bot = bot;
        this._logger = logger;
        this._database = database;

        this.commandModules = new Map();
        this.commands = new Map();
        this.aliases = new Map();
    }

    /**
     * Attaches to the client to start listening for events
     */
    attach(): void {
        this._bot.on('messageCreate', this._messageCreate.bind(this));
    }

    /**
     * Link the command modules with their corresponding backend modules
     * @param modules the modules to link with
     */
    linkModules(modules: Map<string, Module>): void {
        for (const [commandModuleName, commandModule] of this.commandModules) {
            commandModule.parent = modules.get(commandModuleName);
            if (commandModule.parent == undefined)
                throw new Error(
                    `Linking error for module ${commandModuleName}`
                );
            this._logger.handler(
                `Linking Command Module "${commandModuleName}" with module "${commandModule.parent.constructor.name}"`
            );

            if (commandModule.moduleLinked) commandModule.moduleLinked();
        }
    }

    /**
     * Loads commands from a directory
     * @param directory - the directory to load commands from
     */
    async loadCommands(directory: string): Promise<void> {
        this._logger.handler(`Loading Commands in Directory ${directory}.`);
        const modules = await fs.readdir(directory);

        for (const module of modules) {
            const commands = (
                await fs.readdir(path.join(directory, module))
            ).filter(value => value.endsWith('.js'));

            const moduleObj: CommandModule = new (
                await import(path.join(directory, module, 'moduleinfo'))
            ).default();
            this._logger.handler(
                `  Loading Command Module "${moduleObj.info.name}".`
            );

            for (const command of commands) {
                if (command == 'moduleinfo.js') continue;

                this._logger.handler(`    Loading Command "${command}".`);
                const commandObj: BaseCommand = new (
                    await import(path.join(directory, module, command))
                ).default(this._bot, moduleObj);

                moduleObj.registerCommand(commandObj);
                this.commands.set(commandObj.help.name, commandObj);
                if (commandObj.help.aliases != null) {
                    for (const alias of commandObj.help.aliases) {
                        this.aliases.set(alias, commandObj);
                    }
                }
                this._logger.handler(
                    `    Finished Loading Command "${commandObj.constructor.name}".`
                );
            }
            this._logger.handler(
                `  Finished Loading Module "${moduleObj.info.name}".`
            );
            this.commandModules.set(moduleObj.info.name, moduleObj);
        }
        this._logger.handler(
            `Command Loading is complete. ${this.commandModules.size} command modules have been loaded.`
        );
    }

    /**
     * Processes a message when it reaches the bot
     * @param message - the message
     */
    private async _messageCreate(message: Message): Promise<void> {
        if (message.author.bot) return;

        if (
            message.channel instanceof GuildChannel &&
            !message.channel
                .permissionsOf(this._bot.user.id)
                .has('sendMessages')
        )
            return;

        //#region prefix
        let prefix: string | undefined = undefined;
        let prefixes: string[] = [
            `<@${this._bot.user.id}>`,
            `<@!${this._bot.user.id}>`,
        ];

        if (message.channel instanceof GuildChannel) {
            const guildRow = await this._database.connection
                .getCustomRepository(GuildRepository)
                .selectOrCreate(message.channel.guild.id, ['prefix']);
            prefixes = prefixes.concat(guildRow.prefix);
        } else {
            prefixes.push('u!');
        }
        for (const prefixElement of prefixes) {
            if (message.content.toLowerCase().startsWith(prefixElement)) {
                prefix = prefixElement;
                break;
            }
        }
        if (!prefix) return;
        //#endregion

        //#region command discovery
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift();
        if (!command) return;

        const commandObj =
            this.commands.get(command.toLowerCase()) ||
            this.aliases.get(command.toLowerCase());

        if (commandObj == undefined) return;
        if (!commandObj.parent)
            throw new Error(
                `Command object ${commandObj.help.name} doesn't have a parent.`
            );
        //#endregion

        const hookCtx: CommandHookContext = { bot: this._bot, message, args };

        if (
            !(await runHooks(
                hookCtx,
                commandObj.parent.preHooks.concat(commandObj.preHooks)
            ))
        )
            return;

        try {
            await commandObj.execute(new CommandContext(message, args));
        } catch (e) {
            console.error('Bot command error', e.stack);
        }
    }
}

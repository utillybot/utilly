import type { Database } from '@utilly/database';
import { GuildRepository } from '@utilly/database';
import type { Logger } from '@utilly/utils';
import type { Client, Message } from 'eris';
import Eris, { GuildChannel } from 'eris';
import fs from 'fs/promises';
import path from 'path';
import { ROLE_PERMISSIONS } from '../../constants/PermissionConstants';
import { DatabaseModule } from '../ModuleHandler/Module/DatabaseModule';
import type { Module } from '../ModuleHandler/Module/Module';
import type { BaseCommand } from './Command';
import { CommandContext } from './Command';
import type { CommandModule } from './CommandModule';

/**
 * Handles all incoming commands
 */
export class CommandHandler {
    /**
     * A map of command aliases
     */
    readonly aliases: Map<string, BaseCommand>;

    /**
     * A map of command modules
     */
    readonly commandModules: Map<string, CommandModule>;

    /**
     * A map of the registered commands
     */
    readonly commands: Map<string, BaseCommand>;

    private readonly _bot: Client;

    private _logger: Logger;

    private _database: Database;

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

                moduleObj.registerCommand(commandObj.help.name, commandObj);
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
     * Processes a message when it reaches the botou
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

        const commandObj: BaseCommand | undefined =
            this.commands.get(command.toLowerCase()) ||
            this.aliases.get(command.toLowerCase());

        if (commandObj == undefined) return;
        if (!commandObj.parent)
            throw new Error(
                `Command object ${commandObj.help.name} doesn't have a parent.`
            );
        //#endregion

        //#region permission checking

        if (
            !(await commandObj.parent.permissions.checkPermission(message)) ||
            !(await commandObj.permissions.checkPermission(message))
        ) {
            message.channel.createMessage(
                "Uh oh, it looks like you don't have permission to run this command"
            );
            return;
        }

        let allowedIDs: string[] = [];
        let match = false;
        if (commandObj.parent.permissions.userIDs)
            allowedIDs = allowedIDs.concat(
                commandObj.parent.permissions.userIDs
            );
        if (commandObj.permissions.userIDs)
            allowedIDs = allowedIDs.concat(commandObj.permissions.userIDs);

        for (const user of allowedIDs) {
            if (message.author.id == user) match = true;
        }

        if (!match && allowedIDs.length != 0) {
            message.channel.createMessage(
                "Uh oh, it looks like you don't have permission to run this command"
            );
            return;
        }

        if (message.channel instanceof GuildChannel) {
            if (commandObj.parent.parent instanceof DatabaseModule) {
                if (
                    !(await commandObj.parent.parent.isEnabled(
                        message.channel.guild.id
                    ))
                )
                    return;
            }
            const missingBotPerms = [];
            for (const permission of commandObj.permissions.botPerms) {
                if (
                    !message.channel
                        .permissionsOf(this._bot.user.id)
                        .has(permission)
                ) {
                    missingBotPerms.push(
                        ROLE_PERMISSIONS.get(
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            Eris.Constants.Permissions[permission]
                        )
                    );
                }
            }

            if (missingBotPerms.length > 0) {
                await message.channel.createMessage(
                    `The bot is missing the permissions: ${missingBotPerms.join(
                        ', '
                    )}`
                );
                return;
            }

            const missingUserPerms = [];
            for (const permission of commandObj.permissions.userPerms) {
                if (
                    !message.channel
                        .permissionsOf(message.author.id)
                        .has(permission)
                ) {
                    missingUserPerms.push(
                        ROLE_PERMISSIONS.get(
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            Eris.Constants.Permissions[permission]
                        )
                    );
                }
            }

            if (missingUserPerms.length > 0) {
                await message.channel.createMessage(
                    `You are missing the permissions: ${missingBotPerms.join(
                        ', '
                    )}`
                );
                return;
            }
        } else if (commandObj.settings.guildOnly) {
            await message.channel.createMessage(
                'This command can only be ran in a guild.'
            );
            return;
        }
        //#endregion

        try {
            await commandObj.execute(new CommandContext(message, args));
        } catch (e) {
            console.error('Bot command error', e.stack);
        }
    }
}

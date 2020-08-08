import { GuildChannel, Message } from 'eris';
import fs from 'fs/promises';
import path from 'path';
import { getCustomRepository } from 'typeorm';
import Logger from '../../../core/Logger';
import GuildRepository from '../../../database/repository/GuildRepository';
import UtillyClient from '../../UtillyClient';
import DatabaseModule from '../ModuleHandler/Module/DatabaseModule';
import Command from './Command/Command';
import CommandModule from './CommandModule/CommandModule';

/**
 * Handles all incomming commands
 */
export default class CommandHandler {
    commandModules: Map<string, CommandModule>;
    commands: Map<string, Command>;
    aliases: Map<string, Command>;

    private _bot: UtillyClient;
    private _logger: Logger;

    constructor(bot: UtillyClient, logger: Logger) {
        this._bot = bot;
        this._logger = logger;
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
     * Loads commands from a directory
     * @param directory - the directory to load commands from
     */
    async loadCommands(directory: string): Promise<void> {
        this._logger.handler(`Loading Commands in Directory ${directory}.`);
        const modules = await fs.readdir(directory);

        for (const module of modules) {
            let commands = await fs.readdir(path.join(directory, module));
            commands = commands.filter(value => value.endsWith('.js'));

            const moduleObj: CommandModule = new (
                await import(path.join(directory, module, 'moduleinfo'))
            ).default();
            this._logger.handler(
                `  Loading Command Module "${moduleObj.info.name}".`
            );
            for (const command of commands) {
                if (command == 'moduleinfo.js') continue;

                this._logger.handler(`    Loading Command "${command}".`);
                const commandObj: Command = new (
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

        let prefix: string | undefined;
        let prefixes: string[] = [];

        if (message.channel instanceof GuildChannel) {
            const guildRow = await getCustomRepository(
                GuildRepository
            ).selectOrCreate(message.channel.guild.id, ['prefix']);
            prefixes = guildRow.prefix;
        } else {
            prefix = 'u!';
        }

        if (prefix != undefined) {
            if (!message.content.startsWith(prefix)) return;
        } else {
            for (let i = 0; i < prefixes.length; i++) {
                const prefixElement = prefixes[i];
                if (message.content.startsWith(prefixElement)) {
                    prefix = prefixElement;
                    break;
                }
            }
            if (prefix == null) return;
        }

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift();
        if (!command) return;

        let commandObj: Command | undefined;
        if (this.commands.has(command)) {
            commandObj = this.commands.get(command);
            if (!commandObj)
                throw new Error(
                    `Command object ${command} exists in the map but is not getable...`
                );
            if (!commandObj.parent)
                throw new Error(
                    `Command object ${commandObj.help.name} doesn't have a parent.`
                );

            if (!(await commandObj.parent.checkPermission(message))) {
                message.channel.createMessage(
                    "Uh oh, it looks like you don't have permission to run this command"
                );
                return;
            }
            if (!(await commandObj.checkPermission(message))) {
                message.channel.createMessage(
                    "Uh oh, it looks like you don't have permission to run this command"
                );
                return;
            }
        } else if (this.aliases.has(command)) {
            commandObj = this.aliases.get(command);
            if (!commandObj)
                throw new Error(
                    `Command object ${command} exists in the map but is not getable...`
                );
            if (!commandObj.parent)
                throw new Error(
                    `Command object ${commandObj.help.name} doesn't have a parent.`
                );

            if (!(await commandObj.parent.checkPermission(message))) {
                message.channel.createMessage(
                    "Uh oh, it looks like you don't have permission to run this command"
                );
                return;
            }

            if (!(await commandObj.checkPermission(message))) {
                message.channel.createMessage(
                    "Uh oh, it looks like you don't have permission to run this command"
                );
                return;
            }
        } else {
            return;
        }

        if (
            commandObj.settings.guildOnly &&
            !(message.channel instanceof GuildChannel)
        ) {
            await message.channel.createMessage(
                'This command can only be ran in a guild.'
            );
            return;
        }

        if (
            commandObj.parent.parent instanceof DatabaseModule &&
            message.channel instanceof GuildChannel
        ) {
            if (
                !(await commandObj.parent.parent.isEnabled(
                    message.channel.guild.id
                ))
            )
                return;
        }

        try {
            await commandObj.execute(message, args);
        } catch (e) {
            console.error('Bot command error', e.stack);
        }
    }
}

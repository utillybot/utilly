/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message } from 'eris';
import UtillyClient from '../../../UtillyClient';
import Module from '../ModuleHandler/Module/Module';
import { Command } from './Command';

/**
 * Info about this command module
 */
export interface CommandModuleInfo {
    /**
     * The name of this command module
     */
    name: string;
    /**
     * A description of this command module
     */
    description: string;
}

/**
 * A Command Module
 */
export default abstract class CommandModule {
    info: CommandModuleInfo;
    commands: Map<string, Command>;
    aliases: Map<string, Command>;
    parent?: Module;
    private _bot: UtillyClient;

    constructor(bot: UtillyClient) {
        this._bot = bot;
        this.info = {
            name: '',
            description: 'No description provided',
        };
        this.commands = new Map();
        this.aliases = new Map();
    }

    /**
     * Registers a command to this module
     * @param label - the name of the command
     * @param command - the command object
     */
    registerCommand(label: string, command: Command): void {
        this.commands.set(label, command);

        if (command.help.aliases != null) {
            for (const alias of command.help.aliases) {
                this.aliases.set(alias, command);
            }
        }
    }

    /**
     * Returns a list of Commands that have been registered to this module
     */
    getCommands(): Command[] {
        return Array.from(this.commands.values());
    }
    /**
     * Checks if a user is authorized to run commands in this module
     * @param bot - the client
     * @param message - the message
     */
    async checkPermission(message: Message): Promise<boolean> {
        return true;
    }
}

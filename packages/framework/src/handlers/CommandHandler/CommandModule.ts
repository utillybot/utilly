import type { UtillyClient } from '../../UtillyClient';
import type { Module } from '../ModuleHandler/Module/Module';
import type { BaseCommand, CommandPermissions } from './Command';

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
export abstract class CommandModule {
    info: CommandModuleInfo;
    commands: Map<string, BaseCommand>;
    aliases: Map<string, BaseCommand>;
    parent?: Module;
    permissions: CommandPermissions;
    private _bot: UtillyClient;

    constructor(bot: UtillyClient) {
        this._bot = bot;
        this.info = {
            name: '',
            description: 'No description provided',
        };

        this.permissions = {
            botPerms: [],
            userPerms: [],
            checkPermission: async () => true,
        };

        this.commands = new Map();
        this.aliases = new Map();
    }

    /**
     * Registers a command to this module
     * @param label - the name of the command
     * @param command - the command object
     */
    registerCommand(label: string, command: BaseCommand): void {
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
    getCommands(): BaseCommand[] {
        return Array.from(this.commands.values());
    }
}

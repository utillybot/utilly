import type { UtillyClient } from '../../UtillyClient';
import type { Module } from '../ModuleHandler/Module';
import type { BaseCommand } from './Command';
import type { CommandHook } from './CommandHook';

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
 * Lifecycle methods for this command module
 */
export interface CommandModule {
    moduleLinked?(): void;
}

/**
 * A module that can hold command and is linked to a backend module
 */
export abstract class CommandModule {
    /**
     * Info about this command module
     */
    info: CommandModuleInfo;
    /**
     * The part module of this command module that will be injected later
     */
    parent?: Module;

    /**
     * A map of commands that are registered to this module
     */
    readonly commands: Map<string, BaseCommand> = new Map();
    /**
     * A map of command aliases that are registered to this module
     */
    readonly aliases: Map<string, BaseCommand> = new Map();

    /**
     * A list of global pre hooks that will be run as pre hooks for any sub commands for this module
     */
    readonly preHooks: CommandHook[];

    private _bot: UtillyClient;

    /**
     * Creates a new command module
     * @param bot - the client that this module belongs to
     * @protected
     */
    protected constructor(bot: UtillyClient) {
        this._bot = bot;
        this.info = {
            name: '',
            description: 'No description provided',
        };

        this.preHooks = [];
    }

    /**
     * Registers a command and its aliases to this module
     * @param command - the command object
     */
    registerCommand(command: BaseCommand): void {
        this.commands.set(command.help.name, command);

        if (command.help.aliases != null) {
            for (const alias of command.help.aliases) {
                this.aliases.set(alias, command);
            }
        }
    }
}

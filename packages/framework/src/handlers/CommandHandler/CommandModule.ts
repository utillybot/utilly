import type { UtillyClient } from '../../UtillyClient';
import type { BaseCommand } from './Command';
import type { CommandHook } from './CommandHook';
import { loadCommandMetadata, loadPreHookMetadata } from './decorators';

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
export interface BaseCommandModule {
    moduleLinked?(): void;
}

/**
 * A module that can hold command and is linked to a backend module
 */
export abstract class BaseCommandModule {
    /**
     * Info about this command module
     */
    info: CommandModuleInfo = {
        name: '',
        description: 'No description provided',
    };

    /**
     * A map of commands registered to this module
     */
    readonly commands: Map<string, BaseCommand> = new Map();

    /**
     * A map of strings that will trigger that execution of a command
     */
    readonly triggers: Map<string, BaseCommand> = new Map();

    /**
     * A list of global pre hooks that will be run as pre hooks for any sub commands for this module
     */
    readonly preHooks: CommandHook[] = [];

    /**
     * Creates a new command module
     * @param _bot - the client that this module belongs to
     */
    constructor(private _bot: UtillyClient) {}

    /**
     * Registers a command and its aliases to this module
     * @param command - the command object
     */
    registerCommand(command: BaseCommand): BaseCommandModule {
        loadCommandMetadata(command);
        loadPreHookMetadata(command);

        this.commands.set(command.info.name, command);
        this.triggers.set(command.info.name, command);

        if (command.info.aliases != null) {
            for (const alias of command.info.aliases) {
                this.triggers.set(alias, command);
            }
        }

        return this;
    }
}

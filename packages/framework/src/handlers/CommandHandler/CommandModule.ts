import type { UtillyClient } from '../../UtillyClient';
import type { Module } from '../ModuleHandler/Module';
import type { BaseCommand } from './Command';
import type { CommandHook } from './CommandHook';

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

export interface CommandModule {
    moduleLinked?(): void;
}

/**
 * A Command Module
 */
export abstract class CommandModule {
    info: CommandModuleInfo;
    parent?: Module;

    readonly commands: Map<string, BaseCommand>;
    readonly aliases: Map<string, BaseCommand>;

    readonly preHooks: CommandHook[];

    private _bot: UtillyClient;

    protected constructor(bot: UtillyClient) {
        this._bot = bot;
        this.info = {
            name: '',
            description: 'No description provided',
        };

        this.preHooks = [];

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
}

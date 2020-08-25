import { Message } from 'eris';
import Logger from '../../../../core/Logger';

export type Subcommand = (message: Message, args: string[]) => void;

export type Precheck = (message: Message, args: string[]) => Promise<boolean>;

/**
 * Handles Subcommands on request from a Command
 */
export class SubcommandHandler {
    /**
     * The logger to use
     */
    private _logger: Logger;

    /**
     * An array of registered prechecks to run before a subcommand
     */
    private _preChecks: Precheck[];
    /**
     * A map of registered subcommand names to their subcommand
     */
    private _subCommandMap: Map<string, Subcommand>;

    /**
     * Creates a new SubcommandHandler with the specified logger
     * @param logger the logger to use
     */
    constructor(logger: Logger) {
        this._subCommandMap = new Map();
        this._preChecks = [];
        this._logger = logger;
    }

    /**
     * Handles an incomming command and translates it to a subcommand
     * @param message - the message
     * @param args - the arguments
     * @returns a boolean telling whether a subcommand was found
     */
    async handle(message: Message, args: string[]): Promise<boolean> {
        const command = args[0];
        const subCommand = this._subCommandMap.get(command);
        if (subCommand == undefined) return false;
        const newArgs = [...args];
        newArgs.shift();
        for (const preCheck of this._preChecks) {
            if (!(await preCheck(message, newArgs))) return true;
        }
        subCommand(message, newArgs);
        return true;
    }

    /**
     * Registers a precheck to this handler
     * @param preCheck - the precheck function
     */
    registerPrecheck(preCheck: Precheck): void {
        this._preChecks.push(preCheck);
        this._logger.handler('      Loading precheck');
    }

    /**
     * Registers a subcommand to this handler
     * @param label - the name of the subcommand
     * @param command - the subcommand function
     */
    registerSubcommand(label: string, command: Subcommand): void {
        this._subCommandMap.set(label, command);
        this._logger.handler(`      Loading subcommand ${label}`);
    }
}

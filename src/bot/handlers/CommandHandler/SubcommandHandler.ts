import { Message } from 'eris';
import Logger from '../../utilities/Logger';

export type Subcommand = (message: Message, args: string[]) => void;

export type Precheck = (message: Message, args: string[]) => Promise<boolean>;

/**
 * Handles Subcommands on request from a Command
 */
export class SubcommandHandler {
    protected subCommandMap: Map<string, Subcommand>;
    protected preChecks: Precheck[];
    protected logger: Logger;

    constructor(logger: Logger) {
        this.subCommandMap = new Map();
        this.preChecks = [];
        this.logger = logger;
    }

    /**
     * Registers a subcommand to this handler
     * @param label - the name of the subcommand
     * @param command - the subcommand function
     */
    registerSubcommand(label: string, command: Subcommand): void {
        this.subCommandMap.set(label, command);
        this.logger.handler(`      Loading subcommand ${label}`);
    }

    /**
     * Registers a precheck to this handler
     * @param preCheck - the precheck function
     */
    registerPrecheck(preCheck: Precheck): void {
        this.preChecks.push(preCheck);
        this.logger.handler('      Loading precheck');
    }

    /**
     * Handles an incomming command and translates it to a subcommand
     * @param message - the message
     * @param args - the arguments
     * @returns a boolean telling whether a subcommand was found
     */
    async handle(message: Message, args: string[]): Promise<boolean> {
        const command = args[0];
        const subCommand = this.subCommandMap.get(command);
        if (subCommand == undefined) return false;
        const newArgs = [...args];
        newArgs.shift();
        for (let i = 0; i < this.preChecks.length; i++) {
            if (!(await this.preChecks[i](message, newArgs))) return true;
        }
        subCommand(message, newArgs);
        return true;
    }
}

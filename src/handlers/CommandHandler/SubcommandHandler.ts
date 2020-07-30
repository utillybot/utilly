import { Message } from 'eris';
import UtillyClient from '../../bot';
import { Guild } from '../../database/models/Guild';
import Logger from '../../helpers/Logger';

export type Subcommand = (
    bot: UtillyClient,
    message: Message,
    args: string[],
    guildRow?: Guild
) => void;
export type Precheck = (
    bot: UtillyClient,
    message: Message,
    args: string[],
    guildRow?: Guild
) => Promise<boolean>;

/**
 * Handles Subcommands on request from a Command
 */
export class SubcommandHandler {
    private subCommandMap: Map<string, Subcommand>;
    private preChecks: Precheck[];
    private logger: Logger;

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
     * @param bot - the client
     * @param message - the message
     * @param args - the arguments
     * @returns a boolean telling whether a subcommand was found
     */
    async handle(
        bot: UtillyClient,
        message: Message,
        args: string[]
    ): Promise<boolean> {
        const command = args[0];
        if (this.subCommandMap.has(command)) {
            const newArgs = [...args];
            newArgs.shift();
            for (let i = 0; i < this.preChecks.length; i++) {
                if (!(await this.preChecks[i](bot, message, newArgs)))
                    return true;
            }
            this.subCommandMap.get(command)(bot, message, newArgs);
            return true;
        }
        return false;
    }

    async handleGuild(
        bot: UtillyClient,
        message: Message,
        args: string[],
        guildRow: Guild
    ): Promise<boolean> {
        const command = args[0];
        if (this.subCommandMap.has(command)) {
            const newArgs = [...args];
            newArgs.shift();
            for (let i = 0; i < this.preChecks.length; i++) {
                if (!(await this.preChecks[i](bot, message, newArgs, guildRow)))
                    return true;
            }
            this.subCommandMap.get(command)(bot, message, newArgs, guildRow);
            return true;
        }
        return false;
    }
}

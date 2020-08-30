import { GuildChannel, Message } from 'eris';
import { getCustomRepository } from 'typeorm';
import Logger from '../../../core/Logger';
import GuildRepository from '../../../database/repository/GuildRepository';
import EmbedBuilder from '../../utilities/EmbedBuilder';
import { BaseCommand, CommandContext } from './Command';

export interface Subcommand {
    description: string;
    usage: string;
    execute: (ctx: CommandContext) => void;
}

export type Precheck = (ctx: CommandContext) => Promise<boolean>;

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
    async handle(ctx: CommandContext): Promise<boolean> {
        const command = ctx.args[0];
        const subCommand = this._subCommandMap.get(command);
        if (subCommand == undefined) return false;

        const newArgs = [...ctx.args];
        newArgs.shift();

        const newCtx = new CommandContext(ctx.message, newArgs);
        for (const preCheck of this._preChecks) {
            if (!(await preCheck(newCtx))) return true;
        }

        subCommand.execute(newCtx);
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

    async generateHelp(
        parentCommand: BaseCommand,
        message: Message
    ): Promise<EmbedBuilder> {
        let guildRow;
        if (message.channel instanceof GuildChannel) {
            guildRow = await getCustomRepository(
                GuildRepository
            ).selectOrCreate(message.channel.guild.id, ['prefix']);
        }
        const embed = new EmbedBuilder();
        embed.setTitle(`Help for \`${parentCommand.help.name}\`'s subcommands`);
        embed.setDescription(parentCommand.help.description);
        for (const [name, subCommand] of this._subCommandMap) {
            embed.addField(
                `\`${
                    guildRow
                        ? guildRow.prefix
                            ? guildRow.prefix[0]
                            : 'u!'
                        : 'u!'
                }${parentCommand.help.name} ${name}${
                    subCommand.usage ? ' ' + subCommand.usage : ''
                }\``,
                subCommand.description
            );
        }
        embed.addDefaults(message.author);

        return embed;
    }
}

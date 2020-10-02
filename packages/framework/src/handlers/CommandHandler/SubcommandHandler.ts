import { GuildRepository } from '@utilly/database';
import type { Logger } from '@utilly/utils';
import type { Message } from 'eris';
import { GuildChannel } from 'eris';
import type { UtillyClient } from '../../UtillyClient';
import { EmbedBuilder } from '../../utils/EmbedBuilder';
import type { BaseCommand } from './Command';
import { CommandContext } from './Command';

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
    private readonly _preChecks: Precheck[];

    /**
     * A map of registered subcommand names to their subcommand
     */
    private readonly _subCommandMap: Map<string, Subcommand>;

    private _bot: UtillyClient;

    /**
     * Creates a new SubcommandHandler with the specified logger
     * @param logger the logger to use
     */
    constructor(logger: Logger, bot: UtillyClient) {
        this._subCommandMap = new Map();
        this._preChecks = [];
        this._logger = logger;
        this._bot = bot;
    }

    /**
     * Handles an incoming command and translates it to a subcommand
     * @param ctx - the command context
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
            guildRow = await this._bot.database.connection
                .getCustomRepository(GuildRepository)
                .selectOrCreate(message.channel.guild.id, ['prefix']);
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

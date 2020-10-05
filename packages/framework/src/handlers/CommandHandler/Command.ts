import type { Guild, Member, Message, MessageContent } from 'eris';
import { GuildChannel } from 'eris';
import type { UtillyClient } from '../../UtillyClient';
import type { CommandModule } from './CommandModule';
import type { CommandHook } from './CommandHook';

/**
 * Help information for this command
 */
export interface CommandHelp {
    /**
     * The name of the command
     */
    name: string;
    /**
     * The description of the command
     */
    description: string;
    /**
     * The usage of the command
     */
    usage: string;
    /**
     * An array of aliases for this command
     */
    aliases: string[];
}

export interface CommandArgument {
    name: string;
    description: string;
    example: string;
    optional: boolean;
    type: unknown;
}

/**
 * The context the command was run in
 */
export class CommandContext {
    /**
     * The message of this context
     */
    readonly message: Message;

    /**
     * The arguments passed into this command
     */
    readonly args: string[];

    /**
     * The guild that this command was ran in, if it was run in a guild
     */
    readonly guild?: Guild;

    /**
     * The member that ran this command, if there was one
     */
    readonly member?: Member;

    /**
     * Creates a new command context
     * @param message - the message that invoked this command
     * @param args - the arguments passed into the command
     */
    constructor(message: Message, args: string[]) {
        this.message = message;
        this.args = args;

        this.guild =
            message.channel instanceof GuildChannel
                ? message.channel.guild
                : undefined;

        this.member = message.member ?? undefined;
    }

    /**
     * Replies to the user who executed this command.
     * @param content - the content to reply with
     */
    reply(content: MessageContent): Promise<Message> {
        return this.message.channel.createMessage(content);
    }
}

/**
 * A Command
 */
export abstract class BaseCommand {
    /**
     * A CommandHelp object of help info for this command
     */
    help: CommandHelp;

    /**
     * An array of command hooks that will be run prior to the execution of this command.
     */
    preHooks: CommandHook[];

    /**
     * The parent module of this command
     */
    readonly parent?: CommandModule;

    /**
     * The client that this command belongs to
     * @protected
     */
    protected bot: UtillyClient;

    /**
     * Create a new command
     * @param bot - the client that this command belongs to
     * @param parent - the parent command module of this bot
     */
    constructor(bot: UtillyClient, parent: CommandModule) {
        this.bot = bot;
        this.help = {
            name: '',
            description: 'No Description Provided',
            usage: '',
            aliases: [],
        };

        this.preHooks = [];

        this.parent = parent;
    }

    /**
     * Executes this command with the given command context
     * @param ctx - the command context this command was run in
     */
    abstract async execute(ctx: CommandContext): Promise<void>;
}

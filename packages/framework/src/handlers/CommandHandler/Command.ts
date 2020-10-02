import type { Guild, Member, Message, MessageContent } from 'eris';
import { GuildChannel } from 'eris';
import type { UtillyClient } from '../../UtillyClient';
import type { CommandModule } from './CommandModule';
import type { CommandHook } from './CommandHook';

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

    readonly command!: BaseCommand;

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
    readonly help: CommandHelp;

    readonly preHooks: CommandHook[];

    /**
     * The parent module of this command
     */
    readonly parent?: CommandModule;

    protected bot: UtillyClient;

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

    abstract async execute(ctx: CommandContext): Promise<void>;
}

import type { Guild, Member, Message, MessageContent } from 'eris';
import { GuildChannel } from 'eris';
import type { UtillyClient } from '../../UtillyClient';
import type { CommandModule } from './CommandModule';

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
    /**
     * A sentence describing which permissions the user needs to run this command
     */
    permission?: string;
}

export interface CommandSettings {
    /**
     * Whether or not this command can only be executed in a guild
     */
    guildOnly: boolean;
}

export interface CommandPermissions {
    /**
     * The necesary permissions for the bot to run this command
     */
    botPerms: string[];

    /**
     * The necesary permissions for a user to run this command
     */
    userPerms: string[];

    /**
     * A list of user ids that can run this command
     */
    userIDs?: string[];

    /**
     * A function returning weather the command can be executed
     */
    checkPermission: (message: Message) => Promise<boolean> | boolean;
}

export class CommandContext {
    /**
     * The message of this context
     */
    message: Message;

    /**
     * The arguments passed into this command
     */
    args: string[];

    /**
     * The guild that this command was ran in, if it was run in a guild
     */
    guild?: Guild;

    /**
     * The member that ran this command, if there was one
     */
    member?: Member;

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
     * A CommandSettings object of settings for this command
     */
    settings: CommandSettings;

    /**
     * A CommandPermissions object of permissions for this command
     */
    permissions: CommandPermissions;

    /**
     * The parent module of this command
     */
    parent?: CommandModule;

    protected bot: UtillyClient;

    constructor(bot: UtillyClient, parent: CommandModule) {
        this.bot = bot;
        this.help = {
            name: '',
            description: 'No Description Provided',
            usage: '',
            aliases: [],
        };

        this.settings = {
            guildOnly: false,
        };

        this.permissions = {
            botPerms: [],
            userPerms: [],
            checkPermission: () => true,
        };
        this.parent = parent;
    }

    abstract async execute(ctx: CommandContext): Promise<void>;
}

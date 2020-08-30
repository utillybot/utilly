/* eslint-disable @typescript-eslint/no-unused-vars */
import { Guild, GuildChannel, Member, Message, MessageContent } from 'eris';
import UtillyClient from '../../../UtillyClient';
import CommandModule from './CommandModule';

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
    botPerms: string[];

    userPerms: string[];

    userIDs?: string[];

    checkPermission: (message: Message) => Promise<boolean> | boolean;
}

export class CommandContext {
    message: Message;

    args: string[];

    guild?: Guild;

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
    /**
     * Executes the command
     * @param message - the message
     * @param args - the arguments
     */
    abstract async execute(ctx: CommandContext): Promise<void>;
}

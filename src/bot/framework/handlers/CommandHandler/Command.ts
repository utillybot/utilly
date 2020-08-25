/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message } from 'eris';
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
    /**
     * The permissions the bot needs
     */
    botPerms: string[];
}

/**
 * A Command
 */
export default abstract class Command {
    /**
     * A CommandHelp object of help info for this command
     */
    help: CommandHelp;

    /**
     * A CommandSettings object of settings for this command
     */
    settings: CommandSettings;

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
            botPerms: [],
        };
        this.parent = parent;
    }

    /**
     * Checks if a user has permission to run a command
     * @param message - the message
     */
    async checkPermission(message: Message): Promise<boolean> {
        return true;
    }

    /**
     * Executes the command
     * @param message - the message
     * @param args - the arguments
     */
    abstract async execute(message: Message, args: string[]): Promise<void>;
}

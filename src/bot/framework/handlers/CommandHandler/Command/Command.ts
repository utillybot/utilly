/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message } from 'eris';
import UtillyClient from '../../../../UtillyClient';
import CommandModule from '../CommandModule/CommandModule';
import ICommandHelp from './ICommandHelp';
import ICommandSettings from './ICommandSettings';

/**
 * A Command
 */
export default abstract class Command {
    bot: UtillyClient;
    help: ICommandHelp;
    settings: ICommandSettings;
    parent?: CommandModule;

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
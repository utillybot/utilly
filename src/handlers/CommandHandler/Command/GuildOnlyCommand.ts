/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message } from 'eris';
import UtillyClient from '../../../bot';
import { Guild } from '../../../database/models/Guild';
import Command from './Command';

/**
 * A Command
 */
export default abstract class GuildOnlyCommand extends Command {
    constructor(bot: UtillyClient) {
        super(bot);

        this.settings = {
            guildOnly: false,
        };
    }

    /**
     * Checks if a user is authorized to run a command
     * @param bot - the client
     * @param message - the message
     */
    async checkPermission(
        bot: UtillyClient,
        message: Message
    ): Promise<boolean> {
        return true;
    }

    /**
     * Executes the command
     * @param bot - the client
     * @param message - the message
     * @param args - the arguments
     */
    abstract async execute(
        bot: UtillyClient,
        message: Message,
        args: string[],
        guildRow: Guild
    ): Promise<void>;
}

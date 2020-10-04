import type { MessageContent } from 'eris';
import type { CommandHookContext } from '../CommandHook';
import { CommandHook } from '../CommandHook';
import type { PermsValidatorHookSettings } from './PermsValidatorHook';
import { PermsValidatorHook } from './PermsValidatorHook';
import type { NextFunction } from '../../Hook';
import type { Client, Message } from 'eris';

/**
 * Settings for the bot permission validator hook
 */
export interface BotPermValidatorHookSettings
    extends Omit<PermsValidatorHookSettings, 'id'> {
    /**
     * A function return an error message if the bot is missing permissions
     * @param missingBotPerms - the permissions the bot is missing
     */
    errorMessage?: (missingBotPerms: string[]) => MessageContent;

    /**
     * A function returning the id to check permissions on
     * @param client - the client user
     * @param message - the message that invoked this hook
     */
    id?: (client: Client, message: Message) => string;
}

export interface BotPermsValidatorHook {
    /**
     * The settings for this hook
     */
    settings: BotPermValidatorHookSettings;
}

/**
 * A hook to validate if the bot has certain permissions
 */
export class BotPermsValidatorHook extends CommandHook {
    constructor(settings: BotPermValidatorHookSettings) {
        super(settings);
        if (!this.settings.errorMessage)
            settings.errorMessage = missingBotPerms =>
                `The bot is missing the following permissions necessary to execute this command: ${missingBotPerms.join(
                    ', '
                )}`;
        if (!this.settings.id) this.settings.id = bot => bot.user.id;
    }

    execute(ctx: CommandHookContext, next: NextFunction): void {
        new PermsValidatorHook(this.settings).execute(ctx, next);
    }
}

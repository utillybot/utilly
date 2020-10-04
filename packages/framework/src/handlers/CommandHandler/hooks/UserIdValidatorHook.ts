import type { CommandHookContext } from '../CommandHook';
import { CommandHook } from '../CommandHook';
import type { MessageContent } from 'eris';
import type { NextFunction } from '../../Hook';

/**
 * Settings for the user id validator hook
 */
export interface UserIdValidatorHookSettings {
    /**
     * An array of ids that can pass this hook
     */
    allowedIds: string[];
    /**
     * An error message to send if the people didn't pass the hook
     */
    errorMessage?: MessageContent;
}

export interface UserIdValidatorHook {
    /**
     * The settings for this hook
     */
    settings: UserIdValidatorHookSettings;
}

/**
 * A hook to check if a user is in a certain array of users
 */
export class UserIdValidatorHook extends CommandHook {
    execute({ message }: CommandHookContext, next: NextFunction): void {
        if (!this.settings.errorMessage)
            this.settings.errorMessage =
                "You don't have permission to run this command";
        let match = false;

        for (const user of this.settings.allowedIds) {
            if (message.author.id == user) match = true;
        }

        if (!match && this.settings.allowedIds.length != 0) {
            message.channel.createMessage(this.settings.errorMessage);
        } else {
            next();
        }
    }
}

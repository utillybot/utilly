import type { Message, MessageContent } from 'eris';
import type { CommandHookContext } from '../CommandHook';
import { CommandHook } from '../CommandHook';
import type { NextFunction } from '../../Hook';

/**
 * Settings for the user validator hook
 */
interface UserValidatorHookSettings {
    /**
     * An error message to send if the person didn't pass the hook
     */
    errorMessage?: MessageContent;
    /**
     * A function taking in the message that executed the command and returns if the author is allowed to proceed with the command
     * @param message - the message that executed the command
     */
    checkPermission: (message: Message) => boolean;
}

export interface UserValidatorHook {
    /**
     * The settings for this hook
     */
    settings: UserValidatorHookSettings;
}

/**
 * A hook to check if the author of a command passes a check permission function
 */
export class UserValidatorHook extends CommandHook {
    execute({ message }: CommandHookContext, next: NextFunction): void {
        if (!this.settings.errorMessage)
            this.settings.errorMessage =
                'You do not have permission to run this command.';

        if (this.settings.checkPermission(message)) {
            next();
        } else {
            message.channel.createMessage(this.settings.errorMessage);
        }
    }
}

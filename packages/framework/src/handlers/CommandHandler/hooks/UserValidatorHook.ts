import type { Message, MessageContent } from 'eris';
import type { CommandHook } from '../CommandHook';

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

/**
 * A hook to check if the author of a command passes a check permission function
 *
 * @param settings - The settings for this hook
 */
export const UserValidatorHook = (
    settings: UserValidatorHookSettings
): CommandHook => {
    return ({ message }, next): void => {
        if (!settings.errorMessage)
            settings.errorMessage =
                'You do not have permission to run this command.';

        if (settings.checkPermission(message)) {
            next();
        } else {
            message.channel.createMessage(settings.errorMessage);
        }
    };
};

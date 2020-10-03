import type { Message, MessageContent } from 'eris';
import type { CommandHookContext, CommandHookNext } from '../CommandHook';
import { CommandHook } from '../CommandHook';

/**
 * Settings for the user validator hook
 */
interface UserValidatorHookSettings {
    /**
     * An error message to send if the person didn't pass the hook
     */
    errorMessage?: MessageContent;
}

/**
 * Properties for the user validator hook
 */
interface UserValidatorHookProps {
    /**
     * A function taking in the message that executed the command and returns if the author is allowed to proceed with the command
     * @param message - the message that executed the command
     */
    checkPermission: (message: Message) => boolean;
}

/**
 * A hook to check if the author of a command passes a check permission function
 */
export class UserValidatorHook extends CommandHook {
    /**
     * The settings for this hook
     */
    settings: UserValidatorHookSettings;

    /**
     * This properties for this hook
     */
    props: UserValidatorHookProps;

    constructor(
        settings: UserValidatorHookSettings,
        props: UserValidatorHookProps
    ) {
        super();

        this.settings = settings;
        this.props = props;
    }

    execute({ message }: CommandHookContext, next: CommandHookNext): void {
        if (!this.settings.errorMessage)
            this.settings.errorMessage =
                'You do not have permission to run this command.';

        if (this.props.checkPermission(message)) {
            next();
        } else {
            message.channel.createMessage(this.settings.errorMessage);
        }
    }
}

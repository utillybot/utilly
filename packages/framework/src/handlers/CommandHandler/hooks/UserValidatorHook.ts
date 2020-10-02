import type { Message, MessageContent } from 'eris';
import type { CommandHookContext, CommandHookNext } from '../CommandHook';
import { CommandHook } from '../CommandHook';

interface UserValidatorHookSettings {
    errorMessage?: MessageContent;
}

interface UserValidatorHookProps {
    checkPermission: (message: Message) => boolean;
}

export class UserValidatorHook extends CommandHook {
    settings: UserValidatorHookSettings;
    props: UserValidatorHookProps;

    constructor(
        settings: UserValidatorHookSettings,
        props: UserValidatorHookProps
    ) {
        super();

        this.settings = settings;
        this.props = props;
    }

    run({ message }: CommandHookContext, next: CommandHookNext): void {
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

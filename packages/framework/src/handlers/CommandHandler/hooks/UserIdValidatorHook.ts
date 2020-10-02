import type { CommandHookContext, CommandHookNext } from '../CommandHook';
import { CommandHook } from '../CommandHook';
import type { MessageContent } from 'eris';

export interface UserIdValidatorHookSettings {
    allowedIds: string[];
    errorMessage?: MessageContent;
}

export class UserIdValidatorHook extends CommandHook {
    settings: UserIdValidatorHookSettings;

    constructor(settings: UserIdValidatorHookSettings) {
        super();

        this.settings = settings;
    }

    run({ message }: CommandHookContext, next: CommandHookNext): void {
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

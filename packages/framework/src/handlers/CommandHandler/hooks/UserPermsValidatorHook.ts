import type { MessageContent } from 'eris';
import type { CommandHookContext } from '../CommandHook';
import { CommandHook } from '../CommandHook';
import type { PermsValidatorHookSettings } from './PermsValidatorHook';
import { PermsValidatorHook } from './PermsValidatorHook';
import type { NextFunction } from '../../Hook';
import type { Client, Message } from 'eris';

/**
 * Settings for the user permission validator hook
 */
export interface UserPermsValidatorHookSettings
    extends Omit<PermsValidatorHookSettings, 'id'> {
    /**
     * A function return an error message if the executor of the command is missing permissions
     * @param missingUserPerms - the permissions the user is missing
     */
    errorMessage?: (missingUserPerms: string[]) => MessageContent;

    /**
     * A function returning the id to check permissions on
     * @param client - the client user
     * @param message - the message that invoked this hook
     */
    id?: (client: Client, message: Message) => string;
}

export interface UserPermsValidatorHook {
    /**
     * The settings for this hook
     */
    settings: UserPermsValidatorHookSettings;
}

/**
 * A hook to check if the executor of a command is missing permissions
 */
export class UserPermsValidatorHook extends CommandHook {
    constructor(settings: UserPermsValidatorHookSettings) {
        super(settings);
        if (!this.settings.errorMessage)
            this.settings.errorMessage = missingUserPerms =>
                `You are missing the following permissions necessary to execute this command: ${missingUserPerms.join(
                    ', '
                )}`;
        if (!this.settings.id)
            this.settings.id = (client, message) => message.author.id;
    }

    execute(ctx: CommandHookContext, next: NextFunction): void {
        new PermsValidatorHook(this.settings).execute(ctx, next);
    }
}

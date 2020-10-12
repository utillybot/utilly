import type { MessageContent } from 'eris';
import type { CommandHookContext } from '../CommandHook';
import type { CommandHook } from '../CommandHook';
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
 *
 * @param settings - The settings for this hook
 */
export const UserPermsValidatorHook = (
    settings: UserPermsValidatorHookSettings
): CommandHook => {
    return (ctx, next): void => {
        const newSettings = Object.assign(
            {
                errorMessage: (missingUserPerms: string[]) =>
                    `You are missing the following permissions necessary to execute this command: ${missingUserPerms.join(
                        ', '
                    )}`,
                id: (client: Client, message: Message) => message.author.id,
            },
            settings
        );

        PermsValidatorHook(newSettings)(ctx, next);
    };
};

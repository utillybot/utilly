import type { MessageContent, Client, Message } from 'eris';
import { Constants } from 'eris';
import { GuildChannel } from 'eris';
import type { CommandHookContext } from '../CommandHook';
import { ROLE_PERMISSIONS } from '../../..';
import { CommandHook } from '../CommandHook';
import type { NextFunction } from '../../Hook';

/**
 * Settings for the permission validator hook
 */
export interface PermsValidatorHookSettings {
    /**
     * A list of permissions to validate
     */
    permissions: string[];
    /**
     * A function return an error message if the user passed in is missing permissions
     * @param missingPerms - the permissions the user passed in is missing
     */
    errorMessage?: (missingPerms: string[]) => MessageContent;
    /**
     * A function returning the id to check permissions on
     * @param client - the client user
     * @param message - the message that invoked this hook
     */
    id: (client: Client, message: Message) => string;
}

export interface PermsValidatorHook {
    /**
     * The settings for this hook
     */
    settings: PermsValidatorHookSettings;
}

/**
 * A hook to check if a given user contains the permissions passed in
 */
export class PermsValidatorHook extends CommandHook {
    execute({ bot, message }: CommandHookContext, next: NextFunction): void {
        const id = this.settings.id(bot, message);

        if (!this.settings.errorMessage)
            this.settings.errorMessage = (missingPerms: string[]) =>
                `Uh oh, ${
                    bot.users.get(id)?.username
                } is missing these permissions ${missingPerms.join(', ')}`;

        const missingPerms = [];
        if (!(message.channel instanceof GuildChannel)) return;
        for (const permission of this.settings.permissions) {
            if (!message.channel.permissionsOf(id).has(permission)) {
                const item = ROLE_PERMISSIONS.get(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    Constants.Permissions[permission]
                );
                if (item) missingPerms.push(item);
            }
        }

        if (missingPerms.length > 0) {
            message.channel.createMessage(
                this.settings.errorMessage(missingPerms)
            );
        } else {
            next();
        }
    }
}

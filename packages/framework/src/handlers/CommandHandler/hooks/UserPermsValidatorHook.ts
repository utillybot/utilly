import type { MessageContent } from 'eris';
import type { CommandHookContext, CommandHookNext } from '../CommandHook';
import { CommandHook } from '../CommandHook';
import type { PermsValidatorHookSettings } from './PermsValidatorHook';
import type { BotPermValidatorHookProps } from './BotPermsValidatorHook';
import { PermsValidatorHook } from './PermsValidatorHook';

/**
 * Properties for the user permission validator hook
 */
export interface UserPermsValidatorHookProps {
    /**
     * A function return an error message if the executor of the command is missing permissions
     * @param missingUserPerms - the permissions the user is missing
     */
    errorMessage?: (missingUserPerms: string[]) => MessageContent;
}

/**
 * A hook to check if the executor of a command is missing permissions
 */
export class UserPermsValidatorHook extends CommandHook {
    /**
     * The settings for this hook
     */
    settings: PermsValidatorHookSettings;

    /**
     * This properties for this hook
     */
    props: BotPermValidatorHookProps;

    constructor(
        settings: PermsValidatorHookSettings,
        props?: BotPermValidatorHookProps
    ) {
        super();
        if (!props || !props.errorMessage)
            props = {
                errorMessage: missingUserPerms =>
                    `You are missing the following permissions necessary to execute this command: ${missingUserPerms.join(
                        ', '
                    )}`,
            };
        this.settings = settings;
        this.props = props;
    }

    execute(ctx: CommandHookContext, next: CommandHookNext): void {
        new PermsValidatorHook(this.settings, {
            errorMessage: this.props.errorMessage,
            id: (client, message) => message.author.id,
        }).execute(ctx, next);
    }
}

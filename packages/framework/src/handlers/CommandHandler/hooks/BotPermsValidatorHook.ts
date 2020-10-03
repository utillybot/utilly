import type { MessageContent } from 'eris';
import type { CommandHookContext, CommandHookNext } from '../CommandHook';
import { CommandHook } from '../CommandHook';
import type { PermsValidatorHookSettings } from './PermsValidatorHook';
import { PermsValidatorHook } from './PermsValidatorHook';

/**
 * Properties for the bot permission validator hook
 */
export interface BotPermValidatorHookProps {
    /**
     * A function return an error message if the bot is missing permissions
     * @param missingBotPerms - the permissions the bot is missing
     */
    errorMessage?: (missingBotPerms: string[]) => MessageContent;
}

/**
 * A hook to validate if the bot has certain permissions
 */
export class BotPermsValidatorHook extends CommandHook {
    /**
     * The settings for this hook
     */
    settings: PermsValidatorHookSettings;

    /**
     * The properties for this hook
     */
    props: BotPermValidatorHookProps;

    constructor(
        settings: PermsValidatorHookSettings,
        props?: BotPermValidatorHookProps
    ) {
        super();
        if (!props || !props.errorMessage)
            props = {
                errorMessage: missingBotPerms =>
                    `The bot is missing the following permissions necessary to execute this command: ${missingBotPerms.join(
                        ', '
                    )}`,
            };
        this.settings = settings;
        this.props = props;
    }

    execute(ctx: CommandHookContext, next: CommandHookNext): void {
        new PermsValidatorHook(this.settings, {
            errorMessage: this.props.errorMessage,
            id: client => client.user.id,
        }).execute(ctx, next);
    }
}

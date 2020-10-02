import type { MessageContent } from 'eris';
import type { CommandHookContext, CommandHookNext } from '../CommandHook';
import { CommandHook } from '../CommandHook';
import type { PermsValidatorHookSettings } from './PermsValidatorHook';
import { PermsValidatorHook } from './PermsValidatorHook';

export interface BotPermValidatorHookProps {
    errorMessage?: (missingBotPerms: string[]) => MessageContent;
}

export class BotPermsValidatorHook extends CommandHook {
    settings: PermsValidatorHookSettings;
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

    run(ctx: CommandHookContext, next: CommandHookNext): void {
        new PermsValidatorHook(this.settings, {
            errorMessage: this.props.errorMessage,
            id: client => client.user.id,
        }).run(ctx, next);
    }
}

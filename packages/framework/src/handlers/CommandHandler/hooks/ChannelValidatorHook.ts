import type { CommandHookContext, CommandHookNext } from '../CommandHook';
import { CommandHook } from '../CommandHook';
import { GuildChannel, PrivateChannel } from 'eris';

type ChannelType = 'guild' | 'dm';

export interface ChannelValidatorHookSettings {
    channel: ChannelType[];
}

export class ChannelValidatorHook extends CommandHook {
    settings: ChannelValidatorHookSettings;
    constructor(settings: ChannelValidatorHookSettings) {
        super();

        this.settings = settings;
    }

    run({ message }: CommandHookContext, next: CommandHookNext): void {
        for (const channel of this.settings.channel) {
            if (
                channel == 'guild'
                    ? message.channel instanceof GuildChannel
                    : channel == 'dm'
                    ? message.channel instanceof PrivateChannel
                    : true
            ) {
                next();
            }
        }
    }
}

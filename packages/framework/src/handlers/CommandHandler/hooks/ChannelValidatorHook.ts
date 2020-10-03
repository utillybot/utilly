import type { CommandHookContext, CommandHookNext } from '../CommandHook';
import { CommandHook } from '../CommandHook';
import { GuildChannel, PrivateChannel } from 'eris';

type ChannelType = 'guild' | 'dm';

/**
 * Settings for this channel validator hook
 */
export interface ChannelValidatorHookSettings {
    /**
     * An array of channel types that are allowed
     */
    channel: ChannelType[];
}

/**
 * A hook to validate if a channel is a certain type
 */
export class ChannelValidatorHook extends CommandHook {
    /**
     * The settings for this hook
     */
    settings: ChannelValidatorHookSettings;

    constructor(settings: ChannelValidatorHookSettings) {
        super();

        this.settings = settings;
    }

    execute({ message }: CommandHookContext, next: CommandHookNext): void {
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

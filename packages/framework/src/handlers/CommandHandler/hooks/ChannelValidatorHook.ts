import type { CommandHookContext } from '../CommandHook';
import { CommandHook } from '../CommandHook';
import { GuildChannel, PrivateChannel } from 'eris';
import type { NextFunction } from '../../Hook';

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

export interface ChannelValidatorHook {
    /**
     * The settings for this hook
     */
    settings: ChannelValidatorHookSettings;
}

/**
 * A hook to validate if a channel is a certain type
 */
export class ChannelValidatorHook extends CommandHook {
    execute({ message }: CommandHookContext, next: NextFunction): void {
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

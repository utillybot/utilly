import type { CommandHook } from '../CommandHook';
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
 *
 * @param settings - The settings for this hook
 */
export const ChannelValidatorHook = (
    settings: ChannelValidatorHookSettings
): CommandHook => {
    return ({ message }, next): void => {
        for (const channel of settings.channel) {
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
    };
};

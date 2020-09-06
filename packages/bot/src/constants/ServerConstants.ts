import type { Client } from 'eris';

export const DEFAULT_NOTIFICATION_CONSTANTS: Record<number, string> = {
    0: 'All Messages',
    1: 'Only @mentions',
};

export const EXPLICIT_LEVEL_CONSTANTS: Record<number, string> = {
    0: "Don't scan any media content.\nMy friends are nice most of the time.",
    1: 'Scan media content from members without a role.\nRecommended option for servers that use roles for trusted membership.',
    2: 'Scan media content from all members.\nRecommended option for when you want that squeaky clean shine.',
};

export const VERIFICATION_LEVEL_CONSTANTS: Record<number, string> = {
    0: 'None\nUnrestricted',
    1: 'Low\nMust have a verified email on their Discord account.',
    2: 'Medium\nMust also be registered on Discord for longer than 5 minutes.',
    3: 'High\nMust also be a member of this server for longer than 10 minutes.',
    4: 'Highest\nMust have a verified phone on their Discord account.',
};

export const PREMIUM_TIER_CONSTANTS: Record<number, string> = {
    0: 'No Level',
    1: 'Level 1',
    2: 'Level 2',
    3: 'Level 3',
};

export const GUILD_FEATURES_CONSTANTS: Record<string, string> = {};

export const REGIONS_CONSTANTS = async (
    bot: Client
): Promise<Record<string, string>> => {
    const result: Record<string, string> = {};

    for (const region of await bot.getVoiceRegions()) {
        result[region.id] = region.name;
    }
    return result;
};

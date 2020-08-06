export const RolePermissions: Record<number, string> = {
    0x00000001: 'Create Invite',
    0x00000002: 'Kick Members',
    0x00000004: 'Ban Members',
    0x00000008: 'Administrator',

    0x00000010: 'Manage Channels',
    0x00000020: 'Manage Server',
    0x00000040: 'Add Reactions',
    0x00000080: 'View Audit Log',

    0x00000100: 'Priority Speaker',
    0x00000200: 'Video',
    0x00000400: 'Read Text Channels & See Voice Channels',
    0x00000800: 'Send Messages',

    0x00001000: 'Send TTS Messages',
    0x00002000: 'Manage Messages',
    0x00004000: 'Embed Links',
    0x00008000: 'Attach Files',

    0x00010000: 'Read Message History',
    0x00020000: 'Mention \\@everyone and \\@here',
    0x00040000: 'Use External Emojis',
    0x00080000: 'View Server Insights',

    0x00100000: 'Connect',
    0x00200000: 'Speak',
    0x00400000: 'Mute Members',
    0x00800000: 'Deafen Members',

    0x01000000: 'Move Members',
    0x02000000: 'Use Voice Activity',
    0x04000000: 'Change Nickname',
    0x08000000: 'Manage Nicknames',

    0x10000000: 'Manage Roles',
    0x20000000: 'Manage Webhooks',
    0x40000000: 'Manage Emojis',
};

export const ChannelPermissions: Map<number, string> = new Map([
    [0x00000001, 'Create Invite'],
    [0x00000010, 'Manage Channel'],
    [0x10000000, 'Manage Permissions'],
    [0x20000000, 'Manage Webhooks'],

    [0x00000400, 'View Channel'],
    [0x00000800, 'Send Messages'],
    [0x00001000, 'Send TTS Messages'],
    [0x00002000, 'Manage Messages'],
    [0x00004000, 'Embed Links'],
    [0x00008000, 'Attach Files'],
    [0x00010000, 'Read Message History'],
    [0x00020000, 'Mention \\@everyone and \\@here'],
    [0x00040000, 'Use External Emojis'],
    [0x00000040, 'Add Reactions'],

    [0x00100000, 'Connect'],
    [0x00200000, 'Speak'],
    [0x00000200, 'Video'],
    [0x00400000, 'Mute Members'],
    [0x00800000, 'Deafen Members'],
    [0x01000000, 'Move Members'],
    [0x02000000, 'Use Voice Activity'],
    [0x00000100, 'Priority Speaker'],
]);

export const PermissionList: string[] = [
    'createInstantInvite',
    'kickMembers',
    'banMembers',
    'administrator',
    'manageChannels',
    'manageGuild',
    'addReactions',
    'viewAuditLogs',
    'voicePrioritySpeaker',
    'stream',
    'readMessages',
    'sendMessages',
    'sendTTSMessages',
    'manageMessages',
    'embedLinks',
    'attachFiles',
    'readMessageHistory',
    'mentionEveryone',
    'externalEmojis',
    'viewGuildInsights',
    'voiceConnect',
    'voiceSpeak',
    'voiceMuteMembers',
    'voiceDeafenMembers',
    'voiceMoveMembers',
    'voiceUseVAD',
    'changeNickname',
    'manageNicknames',
    'manageRoles',
    'manageWebhooks',
    'manageEmojis',
];

export const Permissions: Record<string, number> = {
    createInstantInvite: 0x00000001,
    kickMembers: 0x00000002,
    banMembers: 0x00000004,
    administrator: 0x00000008,

    manageChannels: 0x00000010,
    manageGuild: 0x00000020,
    addReactions: 0x00000040,
    viewAuditLogs: 0x00000080,

    voicePrioritySpeaker: 0x00000100,
    stream: 0x00000200,
    readMessages: 0x00000400,
    sendMessages: 0x00000800,

    sendTTSMessages: 0x00001000,
    manageMessages: 0x00002000,
    embedLinks: 0x00004000,
    attachFiles: 0x00008000,

    readMessageHistory: 0x00010000,
    mentionEveryone: 0x00020000,
    externalEmojis: 0x00040000,
    viewGuildInsights: 0x00080000,

    voiceConnect: 0x00100000,
    voiceSpeak: 0x00200000,
    voiceMuteMembers: 0x00400000,
    voiceDeafenMembers: 0x00800000,

    voiceMoveMembers: 0x01000000,
    voiceUseVAD: 0x02000000,
    changeNickname: 0x04000000,
    manageNicknames: 0x08000000,

    manageRoles: 0x10000000,
    manageWebhooks: 0x20000000,
    manageEmojis: 0x40000000,
};

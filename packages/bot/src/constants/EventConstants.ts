const MESSAGE_NAMES: Record<string, string> = {
    'message deleted': 'messageDelete',
    'message edited': 'messageUpdate',
    'message bulk deleted': 'messageDeleteBulk',
};

const CHANNEL_NAMES: Record<string, string> = {
    'channel created': 'channelCreate',
    'channel updated': 'channelUpdate',
    'channel deleted': 'channelDelete',
};

const ROLE_NAMES: Record<string, string> = {
    'role created': 'guildRoleCreate',
    'role deleted': 'guildRoleDelete',
    'role updated': 'guildRoleUpdate',
};

const SERVER_NAMES: Record<string, string> = {
    'server updated': 'guildUpdate',
};

export const EVENT_CONSTANTS: {
    [string: string]:
        | typeof MESSAGE_NAMES
        | typeof CHANNEL_NAMES
        | typeof ROLE_NAMES
        | typeof SERVER_NAMES;
} = {
    message: MESSAGE_NAMES,
    channel: CHANNEL_NAMES,
    role: ROLE_NAMES,
    server: SERVER_NAMES,
};

export const EVENT_NAMES: Record<string, string> = {
    'message deleted': 'messageDelete',
    'message edited': 'messageUpdate',
    'message bulk deleted': 'messageDeleteBulk',
    'channel created': 'channelCreate',
    'channel updated': 'channelUpdate',
    'channel deleted': 'channelDelete',
    'role created': 'guildRoleCreate',
    'role deleted': 'guildRoleDelete',
    'role updated': 'guildRoleUpdate',
    'server updated': 'guildUpdate',
};

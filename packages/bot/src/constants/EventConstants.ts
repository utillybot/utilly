const MESSAGE_NAMES: { [string: string]: string } = {
    'message deleted': 'messageDelete',
    'message edited': 'messageUpdate',
    'message bulk deleted': 'messageDeleteBulk',
};

const CHANNEL_NAMES: { [string: string]: string } = {
    'channel created': 'channelCreate',
    'channel updated': 'channelUpdate',
    'channel deleted': 'channelDelete',
};

const ROLE_NAMES: { [string: string]: string } = {
    'role created': 'guildRoleCreate',
    'role deleted': 'guildRoleDelete',
    'role updated': 'guildRoleUpdate',
};

export const EVENT_CONSTANTS: {
    [string: string]:
        | typeof MESSAGE_NAMES
        | typeof CHANNEL_NAMES
        | typeof ROLE_NAMES;
} = {
    message: MESSAGE_NAMES,
    channel: CHANNEL_NAMES,
    role: ROLE_NAMES,
};

export const EVENT_NAMES: { [string: string]: string } = {
    'message deleted': 'messageDelete',
    'message edited': 'messageUpdate',
    'message bulk deleted': 'messageDeleteBulk',
    'channel created': 'channelCreate',
    'channel updated': 'channelUpdate',
    'channel deleted': 'channelDelete',
    'role created': 'guildRoleCreate',
    'role deleted': 'guildRoleDelete',
    'role updated': 'guildRoleUpdate',
};

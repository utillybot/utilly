const MessageNames: { [string: string]: string } = {
    'message deleted': 'messageDelete',
    'message edited': 'messageUpdate',
    'message bulk deleted': 'messageDeleteBulk',
};

const ChannelNames: { [string: string]: string } = {
    'channel created': 'channelCreate',
    'channel updated': 'channelUpdate',
    'channel deleted': 'channelDelete',
};

const RoleNames: { [string: string]: string } = {
    'role created': 'guildRoleCreate',
    'role deleted': 'guildRoleDelete',
    'role updated': 'guildRoleUpdate',
};

export const EventConstants: {
    [string: string]:
        | typeof MessageNames
        | typeof ChannelNames
        | typeof RoleNames;
} = {
    message: MessageNames,
    channel: ChannelNames,
    role: RoleNames,
};

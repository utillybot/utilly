import type { Guild, GuildChannel } from 'eris';

export const parseChannel = (
	channelString: string,
	guild: Guild
): GuildChannel | undefined => {
	// Discovery by channel ID
	if (guild.channels.get(channelString))
		return guild.channels.get(channelString);

	// Discovery by id somewhere inside the string
	const matched = channelString.match(/\d+/);
	if (matched != null && guild.channels.get(matched[0]))
		return guild.channels.get(matched[0]);

	// Discovery by channel name
	const matchedChannel = guild.channels.find(
		channel => channel.name.toLowerCase() == channelString.toLowerCase()
	);
	if (matchedChannel) return matchedChannel;

	return undefined;
};

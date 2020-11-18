import type {
	CategoryChannel,
	Channel,
	GuildChannel,
	NewsChannel,
	PossiblyUncachedMessage,
	PrivateChannel,
	StoreChannel,
	TextChannel,
	VoiceChannel,
} from 'eris';
import { Message } from 'eris';

export const isGuildChannel = (channel: Channel): channel is GuildChannel => {
	return (
		isTextChannel(channel) ||
		isVoiceChannel(channel) ||
		isCategoryChannel(channel) ||
		isNewsChannel(channel) ||
		isStoreChannel(channel)
	);
};

export const isTextChannel = (channel: Channel): channel is TextChannel => {
	return channel.type == 0;
};

export const isPrivateChannel = (
	channel: Channel
): channel is PrivateChannel => {
	return channel.type == 1;
};

export const isVoiceChannel = (channel: Channel): channel is VoiceChannel => {
	return channel.type == 2;
};

export const isCategoryChannel = (
	channel: Channel
): channel is CategoryChannel => {
	return channel.type == 4;
};

export const isNewsChannel = (channel: Channel): channel is NewsChannel => {
	return channel.type == 5;
};

export const isStoreChannel = (channel: Channel): channel is StoreChannel => {
	return channel.type == 6;
};

export const isCachedMessage = (
	message: PossiblyUncachedMessage
): message is Message => {
	return message instanceof Message;
};

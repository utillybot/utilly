import defaultGuildIcon from '../../assets/default_server.png';

export const getGuildIcon = (
	id: string,
	icon: string | null | undefined
): string => {
	return icon
		? `https://cdn.discordapp.com/icons/${id}/${icon}.png`
		: defaultGuildIcon;
};

export const getUserAvatar = (
	id: string,
	avatar: string | null | undefined,
	discriminator: string,
	size?: number
): string => {
	return avatar
		? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=${
				size ?? 256
		  }`
		: `https://cdn.discordapp.com/embed/avatars/${
				parseInt(discriminator) % 5
		  }.png`;
};

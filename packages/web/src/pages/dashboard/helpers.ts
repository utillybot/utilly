import defaultGuildIcon from '../../../assets/default_server.png';

export const getGuildIcon = (
	id: string,
	icon: string | null | undefined
): string => {
	return icon
		? `https://cdn.discordapp.com/icons/${id}/${icon}.png`
		: defaultGuildIcon;
};

export interface User {
	accessToken: string;
	expiresIn: number;
	refreshToken: string;
	scope: string;
	tokenType: string;
}

export interface PartialGuild {
	id: string;
	name: string;
	icon: string | null | undefined;
	owner?: boolean;
	permissions?: number;
	features: string[];
	permissions_new?: string;
}

export interface GuildOverview {
	prefix: string[];
}

declare module 'express-session' {
	interface SessionData {
		user: User;
		guilds: PartialGuild[];
	}
}

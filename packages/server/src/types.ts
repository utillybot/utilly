export interface User {
	accessToken: string;
	expiresIn: number;
	refreshToken: string;
	scope: string;
	tokenType: string;
}

export interface ExtendedUser {
	id: string;
	username: string;
	discriminator: string;
	avatar: string | null | undefined;
	mfa_enabled?: true;
	locale?: string;
	verified?: boolean;
	email?: string | null | undefined;
	flags?: number;
	premium_type?: number;
	public_flags?: number;
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
		extendedUser?: ExtendedUser;
		guilds: PartialGuild[];
	}
}

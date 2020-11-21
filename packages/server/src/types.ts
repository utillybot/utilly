export interface User {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
	token_type: string;
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

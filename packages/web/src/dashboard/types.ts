export interface User {
	id: string;
	username: string;
	discriminator: string;
	avatar: string | null | undefined;
	mfa_enabled?: true;
	locale?: string;
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

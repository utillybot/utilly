interface User {
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

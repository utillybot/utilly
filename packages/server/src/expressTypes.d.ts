import type { PartialGuild, User } from './types';

declare global {
	namespace Express {
		interface Request {
			user: User;
			guild: PartialGuild;
		}
	}
}

export {};

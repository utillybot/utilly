import type { User } from './types';

declare global {
	namespace Express {
		interface Request {
			user: User;
		}
	}
}

export {};

import { createContext } from 'react';
interface PartialGuild {
	id: string;
	name: string;
	icon: string | null | undefined;
	owner?: boolean;
	permissions?: number;
	features: string[];
	permissions_new?: string;
}

export interface GuildContextValue {
	guild: PartialGuild;
}

export const GuildContext = createContext<GuildContextValue | undefined>(
	undefined
);

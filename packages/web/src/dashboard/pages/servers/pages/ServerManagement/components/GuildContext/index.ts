import { createContext } from 'react';
import type { PartialGuild } from '../../../../../../types';

export interface GuildContextValue {
	guild: PartialGuild;
}

const GuildContext = createContext<GuildContextValue | undefined>(undefined);

export default GuildContext;

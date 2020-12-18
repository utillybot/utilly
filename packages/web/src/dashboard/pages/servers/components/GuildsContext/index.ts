import { createContext } from 'react';
import type { PartialGuild } from '../../../../types';

const GuildsContext = createContext<GuildsContextValue | undefined>(undefined);

export interface GuildsContextValue {
	present: PartialGuild[];
	notPresent: PartialGuild[];
}

export default GuildsContext;

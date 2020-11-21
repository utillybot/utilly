import { useContext } from 'react';
import type { GuildContextValue } from '../components/GuildContext';
import { GuildContext } from '../components/GuildContext';

const useGuildContext = (): GuildContextValue => {
	const context = useContext(GuildContext);
	if (!context)
		throw new Error('useCollapsed hook used outside of GuildContext');
	return context;
};

export default useGuildContext;

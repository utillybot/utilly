import { useContext } from 'react';
import type { GuildContextValue } from './index';
import GuildContext from './index';

const useGuildContext = (): GuildContextValue => {
	const context = useContext(GuildContext);
	if (!context)
		throw new Error('useGuildContext hook used outside of GuildContext');
	return context;
};

export default useGuildContext;

import { useContext } from 'react';
import type { GuildsContextValue } from './index';
import GuildsContext from './index';

const useGuildsContext = (): GuildsContextValue | undefined => {
	return useContext(GuildsContext);
};

export default useGuildsContext;

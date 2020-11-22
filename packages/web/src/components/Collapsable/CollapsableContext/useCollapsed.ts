import { useContext } from 'react';
import type { CollapsableContextValue } from './index';
import CollapsableContext from './index';

const useCollapsed = (): CollapsableContextValue => {
	const context = useContext(CollapsableContext);
	if (!context)
		throw new Error('useCollapsed hook used outside of CollapsableContext');
	return context;
};

export default useCollapsed;

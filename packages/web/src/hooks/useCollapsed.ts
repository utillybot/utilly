import { useContext } from 'react';
import type { CollapsableContextValue } from '../components/Collapsable/CollapsableContext';
import { CollapsableContext } from '../components/Collapsable/CollapsableContext';

const useCollapsed = (): CollapsableContextValue => {
	const context = useContext(CollapsableContext);
	if (!context)
		throw new Error('useCollapsed hook used outside of CollapsableContext');
	return context;
};

export default useCollapsed;

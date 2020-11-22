import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

export interface CollapsableContextValue {
	collapsed: boolean;
	setCollapsed: Dispatch<SetStateAction<boolean>>;
}

const CollapsableContext = createContext<CollapsableContextValue | undefined>(
	undefined
);

export default CollapsableContext;

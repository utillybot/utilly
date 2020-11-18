import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

export interface CollapsableContextValue {
	collapsed: boolean;
	setCollapsed: Dispatch<SetStateAction<boolean>>;
}

export const CollapsableContext = createContext<
	CollapsableContextValue | undefined
>(undefined);

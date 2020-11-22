import type { ReactNode } from 'react';
import { useState } from 'react';
import CollapsableContext from '../CollapsableContext';

interface CollapsableProps {
	defaultValue?: boolean;
	children: ReactNode;
}

const CollapsableContent = ({
	defaultValue,
	children,
}: CollapsableProps): JSX.Element => {
	const [collapsed, setCollapsed] = useState(defaultValue ?? true);

	return (
		<CollapsableContext.Provider value={{ collapsed, setCollapsed }}>
			{children}
		</CollapsableContext.Provider>
	);
};

export default CollapsableContent;

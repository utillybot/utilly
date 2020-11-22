import type { CommandsResponse, Resource } from '../../../../API';
import { createContext } from 'react';

const CommandResourceContext = createContext<
	Resource<CommandsResponse> | undefined
>(undefined);

export default CommandResourceContext;

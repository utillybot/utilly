import { useContext } from 'react';
import CommandResourceContext from './index';
import type { CommandsResponse, Resource } from '../../../../API';

const useCommandResource = (): Resource<CommandsResponse> => {
	const context = useContext(CommandResourceContext);
	if (!context)
		throw new Error(
			'useCommandResource hook used outside of CommandResourceContext'
		);
	return context;
};

export default useCommandResource;

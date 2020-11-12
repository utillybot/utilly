import React from 'react';
import CommandModuleTile from './components/CommandModuleTile';
import './CommandModulesPage.module.scss';
import type { CommandsResponse, Resource } from '../../../../API';

interface CommandModulesPageProps {
	resource: Resource<CommandsResponse>;
}

const CommandModulesPage = ({
	resource,
}: CommandModulesPageProps): JSX.Element => {
	const response = resource.read();
	return (
		<div
			styleName={`container ${
				response.commandModules.length == 0 ? 'loading' : ''
			}`}
		>
			{response.commandModules.length == 0 ? (
				<h1 styleName="loading">Loading...</h1>
			) : (
				response.commandModules.map(module => (
					<CommandModuleTile key={module.name} commandModule={module} />
				))
			)}
		</div>
	);
};

export default CommandModulesPage;

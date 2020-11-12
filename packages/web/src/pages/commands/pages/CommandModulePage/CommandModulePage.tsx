import React from 'react';
import { Link, useParams } from 'react-router-dom';
import CommandTile from './components/CommandTile';
import './CommandModulePage.module.scss';
import type { CommandsResponse, Resource } from '../../../../API';

interface CommandModulesPageProps {
	resource: Resource<CommandsResponse>;
}

const CommandModulePage = ({
	resource,
}: CommandModulesPageProps): JSX.Element => {
	const params = useParams<{ module: string }>();

	const module = resource
		.read()
		.commandModules.find(
			mod => mod.name.toLowerCase() == params.module.toLowerCase()
		);

	return (
		<>
			<div styleName="header">
				<div styleName="button">
					<Link to="/commands">ᐸ Back</Link>
				</div>
				<div styleName="text">
					{module ? <h1>{module.name} Module</h1> : ''}
				</div>
			</div>
			<div styleName="container">
				{module ? (
					module.commands.map(cmd => (
						<CommandTile key={cmd.name} command={cmd} />
					))
				) : (
					<h1>Command Module not found</h1>
				)}
			</div>
		</>
	);
};

export default CommandModulePage;

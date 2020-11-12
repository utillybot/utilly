import React from 'react';
import { Link, useParams } from 'react-router-dom';
import CommandCard from './components/CommandCard';
import './CommandPage.module.scss';
import type {
	Command,
	CommandModule,
	CommandsResponse,
	Resource,
} from '../../../../API';

interface CommandPageProps {
	resource: Resource<CommandsResponse>;
}

const CommandPage = ({ resource }: CommandPageProps): JSX.Element => {
	const params = useParams<{ module: string; command: string }>();

	const moduleParam = params.module;
	const commandParam = params.command;

	let command: Command | undefined = undefined;
	let module: CommandModule | undefined = undefined;

	for (const mod of resource.read().commandModules) {
		if (moduleParam.toLowerCase() == mod.name.toLowerCase()) {
			for (const cmd of mod.commands) {
				if (commandParam.toLowerCase() == cmd.name.toLowerCase()) {
					command = cmd;
					module = mod;
				}
			}
		}
	}

	return (
		<div>
			<div styleName="command-header-button">
				<Link to={`/commands${`/${module?.name}` ?? ''}`}>ᐸ Back</Link>
			</div>
			<div styleName="command-header-text">
				{command ? (
					<CommandCard
						name={command.name}
						description={command.description}
						usage={command.usage}
						aliases={command.aliases}
					/>
				) : (
					<h1>Command not found</h1>
				)}
			</div>
		</div>
	);
};

export default CommandPage;

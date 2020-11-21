import CommandModuleTile from './CommandModuleTile';
import styles from './CommandModulesPage.module.scss';
import type { CommandsResponse, Resource } from '../../../../API';

interface CommandModulesPageProps {
	resource: Resource<CommandsResponse>;
}

const CommandModulesPage = ({
	resource,
}: CommandModulesPageProps): JSX.Element => {
	const response = resource.read();
	return (
		<div className={styles.container}>
			{response.commandModules.map(module => (
				<CommandModuleTile key={module.name} commandModule={module} />
			))}
		</div>
	);
};

export default CommandModulesPage;

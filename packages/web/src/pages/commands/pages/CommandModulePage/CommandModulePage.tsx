import { useParams } from 'react-router-dom';
import CommandTile from './CommandTile';
import styles from './CommandModulePage.module.scss';
import type { CommandsResponse, Resource } from '../../../../API';
import Button from '../../../../components/Button/Button';

interface CommandModulesPageProps {
	resource: Resource<CommandsResponse>;
}

const CommandModulePage = ({
	resource,
}: CommandModulesPageProps): JSX.Element => {
	const params = useParams<{ module?: string }>();

	const module = resource
		.read()
		.commandModules.find(
			mod => mod.name.toLowerCase() == params.module?.toLowerCase()
		);

	return (
		<>
			<div className={styles.header}>
				<div className={styles.button}>
					<Button to="/commands" className={styles.back}>
						ᐸ Back
					</Button>
				</div>
				<div className={styles.text}>
					{module ? <h1>{module.name} Module</h1> : ''}
				</div>
			</div>
			<div className={styles.container}>
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

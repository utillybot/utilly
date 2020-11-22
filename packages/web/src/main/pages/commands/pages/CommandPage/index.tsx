import { useParams } from 'react-router-dom';
import CommandCard from './CommandCard';
import styles from './index.module.scss';
import type { Command, CommandModule } from '../../../../API';
import Button from '../../../../../components/Button';
import useCommandResource from '../../components/CommandResourceContext/useCommandResource';

const CommandPage = (): JSX.Element => {
	const resource = useCommandResource();
	const params = useParams<{ module?: string; command?: string }>();

	const moduleParam = params.module;
	const commandParam = params.command;

	let command: Command | undefined = undefined;
	let module: CommandModule | undefined = undefined;

	for (const mod of resource.read().commandModules) {
		if (moduleParam?.toLowerCase() == mod.name.toLowerCase()) {
			for (const cmd of mod.commands) {
				if (commandParam?.toLowerCase() == cmd.name.toLowerCase()) {
					command = cmd;
					module = mod;
				}
			}
		}
	}

	return (
		<>
			<div className={styles.header}>
				<div className={styles.button}>
					<Button
						to={`/commands${`/${module?.name?.toLowerCase()}` ?? ''}`}
						className={styles.back}
					>
						ᐸ Back
					</Button>
				</div>
				<div className={styles.text}>
					{module ? <h1>{command?.name ?? ''} Command</h1> : ''}
				</div>
			</div>
			<div className={styles.text}>
				{command ? (
					<CommandCard
						name={command.name}
						description={command.description}
						usage={command.usage}
						triggers={command.triggers}
					/>
				) : (
					<h1>Command not found</h1>
				)}
			</div>
		</>
	);
};

export default CommandPage;

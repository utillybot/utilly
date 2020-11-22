import CommandModuleTile from './CommandModuleTile';
import styles from './index.module.scss';
import useCommandResource from '../../components/CommandResourceContext/useCommandResource';

const CommandModules = (): JSX.Element => {
	const resource = useCommandResource();
	const response = resource.read();
	return (
		<div className={styles.container}>
			{response.commandModules.map(module => (
				<CommandModuleTile key={module.name} commandModule={module} />
			))}
		</div>
	);
};

export default CommandModules;

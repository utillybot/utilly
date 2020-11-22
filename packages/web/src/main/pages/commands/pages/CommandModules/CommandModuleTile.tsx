import styles from './CommandModuleTile.module.scss';
import { useRouteMatch } from 'react-router-dom';
import type { CommandModule } from '../../../../API';
import Button from '../../../../../components/Button';

interface CommandModuleTileProps {
	commandModule: CommandModule;
}

const CommandModuleTile = ({
	commandModule,
}: CommandModuleTileProps): JSX.Element => {
	const match = useRouteMatch();
	return (
		<Button
			to={`${match.url}/${commandModule.name.toLowerCase()}`}
			className={styles.module}
		>
			<h1>{commandModule.name}</h1>
			<p>{commandModule.description}</p>
		</Button>
	);
};

export default CommandModuleTile;

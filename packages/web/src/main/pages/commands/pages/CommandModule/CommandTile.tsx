import { useRouteMatch } from 'react-router-dom';
import styles from './CommandTile.module.scss';
import type { Command } from '../../../../API';
import Button from '../../../../../components/Button';

interface CommandTileProps {
	command: Command;
}

const CommandTile = ({ command }: CommandTileProps): JSX.Element => {
	const match = useRouteMatch();
	return (
		<Button
			to={`${match.url}/${command.name.toLowerCase()}`}
			className={styles.command}
		>
			<h1>u!{command.name.toLowerCase()}</h1>
			<p>{command.description}</p>
		</Button>
	);
};

export default CommandTile;

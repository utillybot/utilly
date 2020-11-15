import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import styles from './CommandTile.module.scss';
import type { Command } from '../../../../API';

interface CommandTileProps {
	command: Command;
}

const CommandTile = ({ command }: CommandTileProps): JSX.Element => {
	const match = useRouteMatch();
	return (
		<Link
			to={`${match.url}/${command.name.toLowerCase()}`}
			className={styles.command}
		>
			<h1>u!{command.name.toLowerCase()}</h1>
			<p>{command.description}</p>
		</Link>
	);
};

export default CommandTile;

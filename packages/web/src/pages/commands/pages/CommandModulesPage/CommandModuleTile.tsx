import React from 'react';
import styles from './CommandModuleTile.module.scss';
import { useRouteMatch, Link } from 'react-router-dom';
import type { CommandModule } from '../../../../API';

interface CommandModuleTileProps {
	commandModule: CommandModule;
}

const CommandModuleTile = ({
	commandModule,
}: CommandModuleTileProps): JSX.Element => {
	const match = useRouteMatch();
	return (
		<Link
			to={`${match.url}/${commandModule.name.toLowerCase()}`}
			className={styles.module}
		>
			<h1>{commandModule.name}</h1>
			<p>{commandModule.description}</p>
		</Link>
	);
};

export default CommandModuleTile;

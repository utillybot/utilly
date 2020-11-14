import React from 'react';
import styles from './CommandCard.module.scss';
import type { Command } from '../../../../API';

const CommandCard = ({
	name,
	description,
	aliases,
	usage,
}: Command): JSX.Element => {
	return (
		<div className={styles.card}>
			<h1>u!{name}</h1>
			<h3>{description}</h3>
			<h3>
				<b>Usage: </b>
				<code>
					u!{name} {usage}
				</code>
			</h3>
			{aliases.length > 0 ? (
				<h3>
					<b>Aliases:</b>{' '}
					<code>{aliases.map(alias => `u!${alias}`).join(', ')}</code>
				</h3>
			) : (
				''
			)}
		</div>
	);
};

export default CommandCard;

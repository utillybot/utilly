import styles from './CommandCard.module.scss';
import type { Command } from '../../../../API';

const CommandCard = ({
	name,
	description,
	triggers,
	usage,
}: Command): JSX.Element => {
	return (
		<div className={styles.card}>
			<h1>u!{name.toLowerCase()}</h1>
			<h3>{description}</h3>
			<h3>
				<b>Usage: </b>
				<code>
					u!{name.toLowerCase()} {usage}
				</code>
			</h3>
			{triggers.length > 0 && (
				<h3>
					<b>Aliases:</b>{' '}
					<code>{triggers.map(alias => `u!${alias}`).join(', ')}</code>
				</h3>
			)}
		</div>
	);
};

export default CommandCard;

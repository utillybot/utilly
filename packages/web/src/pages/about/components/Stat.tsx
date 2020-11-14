import React from 'react';
import styles from './Stat.module.scss';

interface StatsProps {
	statName: string;
	statValue: string;
	units: string;
}

const Stat = ({ statName, statValue, units }: StatsProps): JSX.Element => {
	return (
		<div className={styles.stat}>
			<h1>{statName}</h1>
			<h2>
				{statValue} {units}
			</h2>
		</div>
	);
};

export default Stat;

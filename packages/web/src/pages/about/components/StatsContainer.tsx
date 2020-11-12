import React, { useEffect, useState } from 'react';
import Stat from './Stat';
import { fetchStats } from '../../../API';

interface StatsContainerState {
	guilds?: number;
	users?: number;
}

const StatsContainer = (): JSX.Element => {
	const [stats, setStats] = useState<StatsContainerState>({});

	useEffect(() => {
		const tick = async () => {
			const stats = await fetchStats();
			if (stats) setStats(stats);
		};
		tick();
		const timerID = setInterval(tick, 15 * 1000);
		return () => {
			clearInterval(timerID);
		};
	});

	return (
		<>
			<Stat
				statName="Guilds"
				statValue={stats.guilds ? stats.guilds.toString() : 'Loading stat'}
				units="guilds"
			/>
			<Stat
				statName="Users"
				statValue={stats.users ? stats.users.toString() : 'Loading stat'}
				units="users"
			/>
		</>
	);
};

export default StatsContainer;

import React, { useEffect, useState } from 'react';
import 'regenerator-runtime/runtime';
import './About.module.scss';
import { fetchStats } from '../../API';
import Stat from './components/Stat';

const About = (): JSX.Element => {
	const [guilds, setGuilds] = useState<number>();
	const [users, setUsers] = useState<number>();

	useEffect(() => {
		const tick = async () => {
			const stats = await fetchStats();
			if (stats) {
				setGuilds(stats.guilds);
				setUsers(stats.users);
			}
		};
		tick();
		const timerID = setInterval(tick, 15 * 1000);
		return () => {
			clearInterval(timerID);
		};
	}, []);

	return (
		<div styleName="page">
			<header>
				<h1>
					Utilly is a modular bot that contains many tools for server owners,
					while also being customizable.
				</h1>
			</header>
			<div styleName="stats">
				<div styleName="header">
					<h2>Statistics</h2>
					<h3>These statistics update every 30 seconds</h3>
				</div>
				<div styleName="container">
					<Stat
						statName="Guilds"
						statValue={guilds ? guilds.toString() : 'Loading stat'}
						units="guilds"
					/>
					<Stat
						statName="Users"
						statValue={users ? users.toString() : 'Loading stat'}
						units="users"
					/>{' '}
				</div>
			</div>
		</div>
	);
};

export default About;

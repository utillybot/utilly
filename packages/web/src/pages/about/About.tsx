import { useEffect, useState } from 'react';
import styles from './About.module.scss';
import { fetchStats } from '../../API';
import Stat from './components/Stat';
import Page from '../../components/Page/Page';
import * as Sentry from '@sentry/react';

const About = (): JSX.Element => {
	const [guilds, setGuilds] = useState<number>();
	const [users, setUsers] = useState<number>();

	const tick = async () => {
		try {
			const stats = await fetchStats();
			if (stats) {
				setGuilds(stats.guilds);
				setUsers(stats.users);
			}
		} catch (error: unknown) {
			Sentry.captureException(error);
		}
	};

	useEffect(() => {
		tick();
		const timerID = setInterval(tick, 15 * 1000);
		return () => clearInterval(timerID);
	}, []);

	return (
		<Page className={styles.page}>
			<header>
				<h1>
					Utilly is a modular bot that contains many tools for server owners,
					while also being customizable.
				</h1>
			</header>
			<div className={styles.stats}>
				<div className={styles.header}>
					<h2>Statistics</h2>
					<h3>These statistics update every 30 seconds</h3>
				</div>
				<div className={styles.container}>
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
		</Page>
	);
};

export default About;

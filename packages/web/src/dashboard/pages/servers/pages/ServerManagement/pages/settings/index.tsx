import { useEffect, useState } from 'react';
import useGuildContext from '../../components/GuildContext/useGuildContext';
import Spinner from '../../../../../../../components/Spinner';
import styles from './index.module.scss';

export interface GuildSettings {
	prefix: string[];
}

const Settings = (): JSX.Element => {
	const [settings, setSettings] = useState<GuildSettings | undefined>(
		undefined
	);
	const guild = useGuildContext().guild;
	useEffect(() => {
		fetch(`/dashboard/api/guilds/${guild.id}/settings`)
			.then(res => {
				if (res.status == 401) {
					document.cookie = `prev=${location.pathname}; path=/;`;
					window.location.assign('/dashboard/login');
				}
				return res.json();
			})
			.then(setSettings);
	}, [guild.id]);

	if (settings == undefined) return <Spinner />;
	return (
		<div className={styles.container}>
			<h2>Prefixes:</h2>
			<ul>
				{settings.prefix.map(prefix => {
					return <li key={prefix}>{prefix}</li>;
				})}
			</ul>
		</div>
	);
};

export default Settings;

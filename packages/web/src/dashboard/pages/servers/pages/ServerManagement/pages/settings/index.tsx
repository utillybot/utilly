import useGuildContext from '../../components/GuildContext/useGuildContext';
import styles from './index.module.scss';
import useProtectedFetch from '../../../../../../hooks/useProtectedFetch';

export interface GuildSettings {
	prefix: string[];
}

const Settings = (): JSX.Element => {
	const guild = useGuildContext().guild;
	const fetchResult = useProtectedFetch<GuildSettings>(
		`/dashboard/api/guilds/${guild.id}/settings`,
		true
	);

	if (!fetchResult[0]) return fetchResult[1];

	const settings = fetchResult[1];

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

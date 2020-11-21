import { useEffect, useState } from 'react';
import Spinner from '../../../../../../components/Spinner/Spinner';
import Page from '../../../../../../components/Page/Page';
import styles from './GuildSelectorPage.module.scss';
import GuildTile from './GuildTile';
import { useLocation } from 'react-router-dom';

interface PartialGuild {
	id: string;
	name: string;
	icon: string | null | undefined;
	owner?: boolean;
	permissions?: number;
	features: string[];
	permissions_new?: string;
}

export const GuildSelectorPage = (): JSX.Element => {
	const [result, setResult] = useState<
		{ present: PartialGuild[]; notPresent: PartialGuild[] } | undefined
	>(undefined);
	const location = useLocation();

	useEffect(() => {
		fetch('/dashboard/api/guilds')
			.then(res => {
				if (res.status == 401) {
					document.cookie = `prev=${location.pathname}; path=/;`;
					window.location.href = '/dashboard/login';
				}
				return res.json();
			})
			.then(setResult);
	}, []);

	if (result == undefined) return <Spinner />;

	return (
		<Page className={styles.page}>
			<h1>Click on a server to manage it</h1>
			<h3>
				Note: The servers shown are the ones that you are the owner of or have
				administrator privileges in.
			</h3>
			<div className={styles.servers}>
				{result.present.map(guild => (
					<GuildTile key={guild.id} guild={guild} />
				))}
				{result.notPresent.map(guild => (
					<GuildTile key={guild.id} guild={guild} inactive />
				))}
			</div>
		</Page>
	);
};

export default GuildSelectorPage;

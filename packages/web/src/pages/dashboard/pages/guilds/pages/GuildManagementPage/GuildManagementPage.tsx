import { useEffect, useState } from 'react';
import Spinner from '../../../../../../components/Spinner/Spinner';
import Page from '../../../../../../components/Page/Page';
import { Route, useParams } from 'react-router-dom';
import styles from './GuildManagement.module.scss';
import { routes } from './routes';
import { GuildContext } from './components/GuildContext';
import GuildManagementNavbar from './components/GuildManagementNavbar';
import { getGuildIcon } from '../../../../helpers';

interface PartialGuild {
	id: string;
	name: string;
	icon: string | null | undefined;
	owner?: boolean;
	permissions?: number;
	features: string[];
	permissions_new?: string;
}

export const GuildManagementPage = (): JSX.Element => {
	const [guild, setGuild] = useState<PartialGuild | undefined>(undefined);
	const params = useParams<{ id: string }>();

	useEffect(() => {
		fetch(`/dashboard/api/guilds/${params.id}`)
			.then(res => {
				if (res.status == 401) {
					document.cookie = `prev=${location.pathname}; path=/;`;
					window.location.href = '/dashboard/login';
				} else if (res.status == 404) {
					document.cookie = `prev=${location.pathname}; path=/;`;
					window.location.href = `/dashboard/invite?id=${params.id}`;
				}
				return res.json();
			})
			.then(setGuild);
	}, [params.id]);

	if (guild == undefined) return <Spinner />;

	return (
		<Page className={styles.page}>
			<GuildContext.Provider value={{ guild: guild }}>
				<header>
					<img src={getGuildIcon(guild.id, guild.icon)} alt="Guild Icon" />
					<h1>{guild.name}</h1>
				</header>
				<GuildManagementNavbar />
				{routes.map(({ exact, name, path, page }) => (
					<Route
						exact={exact ?? true}
						key={name}
						path={path}
						component={page}
					/>
				))}
			</GuildContext.Provider>
		</Page>
	);
};

export default GuildManagementPage;

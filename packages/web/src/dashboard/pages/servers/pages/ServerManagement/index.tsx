import { useParams } from 'react-router-dom';
import styles from './index.module.scss';
import { routes } from './routes';
import GuildContext from './components/GuildContext';
import Navbar from './components/Navbar';
import { getGuildIcon } from '../../../../helpers';
import Page from '../../../../components/Page';
import parseRoutes from '../../../../../components/Routes';
import useProtectedFetch from '../../../../hooks/useProtectedFetch';
import type { PartialGuild } from '../../../../types';

const ServerManagement = (): JSX.Element => {
	const params = useParams<{ id: string }>();

	const fetchResult = useProtectedFetch<PartialGuild>(
		`/dashboard/api/guilds/${params.id}`,
		true
	);

	if (!fetchResult[0]) return fetchResult[1];

	const guild = fetchResult[1];

	return (
		<Page className={styles.page}>
			<GuildContext.Provider value={{ guild: guild }}>
				<header>
					<img src={getGuildIcon(guild.id, guild.icon)} alt="Guild Icon" />
					<h1>{guild.name}</h1>
				</header>
				<Navbar />
				{parseRoutes(routes)}
			</GuildContext.Provider>
		</Page>
	);
};

export default ServerManagement;

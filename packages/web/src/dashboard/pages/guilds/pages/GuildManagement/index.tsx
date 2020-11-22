import { useEffect, useState } from 'react';
import Spinner from '../../../../../components/Spinner';
import { useParams } from 'react-router-dom';
import styles from './index.module.scss';
import { routes } from './routes';
import GuildContext from './components/GuildContext';
import Navbar from './components/Navbar';
import { getGuildIcon } from '../../../../helpers';
import Routes from '../../../../../components/Routes';
import Page from '../../../../components/Page';

interface PartialGuild {
	id: string;
	name: string;
	icon: string | null | undefined;
	owner?: boolean;
	permissions?: number;
	features: string[];
	permissions_new?: string;
}

const GuildManagement = (): JSX.Element => {
	const [guild, setGuild] = useState<PartialGuild | undefined>(undefined);
	const params = useParams<{ id: string }>();

	useEffect(() => {
		fetch(`/dashboard/api/guilds/${params.id}`)
			.then(res => {
				if (res.status == 401) {
					document.cookie = `prev=${location.pathname}; path=/;`;
					window.location.assign('/dashboard/login');
				} else if (res.status == 404) {
					document.cookie = `prev=${location.pathname}; path=/;`;
					window.location.assign('/dashboard/invite?id=${params.id}');
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
				<Navbar />
				<Routes routes={routes} />
			</GuildContext.Provider>
		</Page>
	);
};

export default GuildManagement;

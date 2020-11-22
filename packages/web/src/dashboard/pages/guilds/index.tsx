import GuildSelector from './pages/GuildSelector';
import GuildManagement from './pages/GuildManagement';
import type { RouteData } from '../../../components/Routes/types';
import Routes from '../../../components/Routes';

const routes: RouteData[] = [
	{
		path: '/dashboard/guilds',
		page: GuildSelector,
		exact: true,
	},
	{
		path: '/dashboard/guilds/:id',
		page: GuildManagement,
		exact: false,
	},
];

const Guilds = (): JSX.Element => {
	return (
		<>
			<Routes routes={routes} />
		</>
	);
};

export default Guilds;

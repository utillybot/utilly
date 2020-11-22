import ServerSelector from './pages/ServerSelector';
import ServerManagement from './pages/ServerManagement';
import type { RouteData } from '../../../components/Routes/types';
import Routes from '../../../components/Routes';

const routes: RouteData[] = [
	{
		path: '/dashboard/servers',
		page: ServerSelector,
		exact: true,
	},
	{
		path: '/dashboard/servers/:id',
		page: ServerManagement,
		exact: false,
	},
];

const Servers = (): JSX.Element => {
	return (
		<>
			<Routes routes={routes} />
		</>
	);
};

export default Servers;

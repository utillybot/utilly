import type { NavbarRouteData } from '../../../../../components/Routes/types';
import Overview from './pages/overview/Overview';

export const routes: NavbarRouteData[] = [
	{
		path: '/dashboard/guilds/:id',
		name: 'Overview',
		page: Overview,
		exact: true,
	},
	{
		path: '/dashboard/guilds/:id/settings',
		name: 'Settings',
		page: Overview,
		exact: true,
	},
	{
		path: '/dashboard/guilds/:id/modules',
		name: 'Modules',
		page: Overview,
		exact: false,
	},
];

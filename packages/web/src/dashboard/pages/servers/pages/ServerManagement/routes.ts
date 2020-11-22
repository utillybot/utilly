import type { NavbarRouteData } from '../../../../../components/Routes/types';
import Overview from './pages/overview/Overview';

export const routes: NavbarRouteData[] = [
	{
		path: '/dashboard/servers/:id',
		name: 'Overview',
		page: Overview,
		exact: true,
	},
	{
		path: '/dashboard/servers/:id/settings',
		name: 'Settings',
		page: Overview,
		exact: true,
	},
	{
		path: '/dashboard/servers/:id/modules',
		name: 'Modules',
		page: Overview,
		exact: false,
	},
];

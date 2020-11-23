import type { NavbarRouteData } from '../../../../../components/Routes/types';
import Overview from './pages/overview';
import Settings from './pages/settings';

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
		page: Settings,
		exact: true,
	},
	{
		path: '/dashboard/servers/:id/modules',
		name: 'Modules',
		page: Overview,
		exact: false,
	},
];

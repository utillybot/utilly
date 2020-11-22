import type { NavbarRouteData } from '../components/Routes/types';
import Home from './pages/home';
import Guilds from './pages/guilds';
import Error from './pages/error';

export const routes: NavbarRouteData[] = [
	{
		path: '/dashboard',
		name: 'Home',
		page: Home,
		exact: true,
	},
	{
		path: '/dashboard/guilds',
		name: 'Servers',
		page: Guilds,
		exact: false,
	},
	{
		path: '/dashboard/error',
		name: 'Error',
		page: Error,
		exact: true,
		displayInNavbar: false,
	},
];

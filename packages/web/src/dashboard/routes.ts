import type { NavbarRouteData } from '../components/Routes/types';
import Home from './pages/home';
import Servers from './pages/servers';
import Error from './pages/error';

export const routes: NavbarRouteData[] = [
	{
		path: '/dashboard',
		name: 'Home',
		page: Home,
		exact: true,
	},
	{
		path: '/dashboard/servers',
		name: 'Servers',
		page: Servers,
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

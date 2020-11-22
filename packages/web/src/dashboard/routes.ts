import type { NavbarRouteData, RouteData } from '../components/Routes/types';
import Home from './pages/home';
import Servers from './pages/servers';
import Error from './pages/error';
import Done from './pages/done';
import Login from './pages/login';

export const protectedRoutes: NavbarRouteData[] = [
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
];

export const staticRoutes: RouteData[] = [
	{
		path: '/dashboard/login',
		page: Login,
		exact: true,
	},
	{
		path: '/dashboard/error',
		page: Error,
		exact: true,
	},
	{
		path: '/dashboard/done',
		page: Done,
		exact: true,
	},
];

import Home from './pages/home';
import About from './pages/about';
import { lazy } from 'react';
import type { NavbarRouteData } from '../components/Routes/types';

export const routes: NavbarRouteData[] = [
	{
		path: '/',
		name: 'Home',
		page: Home,
		exact: true,
	},
	{
		path: '/about',
		name: 'About',
		page: About,
		exact: true,
	},
	{
		path: '/commands',
		name: 'Commands',
		page: lazy(() => import('./pages/commands')),
		exact: false,
	},
];

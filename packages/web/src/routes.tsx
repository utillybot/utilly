import Home from './pages/home/Home';
import About from './pages/about/About';
import type { lazy } from 'react';
import React from 'react';

export interface RouteData {
	path: string;
	name: string;
	page: ReturnType<typeof lazy> | (() => JSX.Element);
	exact?: boolean;
}

export const routes: RouteData[] = [
	{
		path: '/',
		name: 'Home',
		page: Home,
	},

	{
		path: '/about',
		name: 'About',
		page: About,
	},

	{
		path: '/commands',
		name: 'Commands',
		page: React.lazy(() => import('./pages/commands/Commands')),
		exact: false,
	},
];

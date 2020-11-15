import Home from './pages/home/Home';
import About from './pages/about/About';
import Commands from './pages/commands/Commands';
import React from 'react';

export interface RouteData {
	path: string;
	name: string;
	page: JSX.Element;
	exact?: boolean;
}

export const ROUTE_CONSTANTS: RouteData[] = [
	{
		path: '/',
		name: 'Home',
		page: <Home />,
	},

	{
		path: '/about',
		name: 'About',
		page: <About />,
	},

	{
		path: '/commands',
		name: 'Commands',
		page: <Commands />,
		exact: false,
	},
];
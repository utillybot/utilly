import type { lazy } from 'react';
import Overview from './pages/overview/Overview';

export interface RouteData {
	path: string;
	name: string;
	page: ReturnType<typeof lazy> | (() => JSX.Element);
	exact?: boolean;
}

export const routes: RouteData[] = [
	{
		path: '/dashboard/guilds/:id',
		name: 'Overview',
		page: Overview,
	},
	{
		path: '/dashboard/guilds/:id/settings',
		name: 'Settings',
		page: Overview,
	},
	{
		path: '/dashboard/guilds/:id/modules',
		name: 'Modules',
		page: Overview,
	},
];

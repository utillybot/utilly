import type { lazy } from 'react';

export interface RouteData {
	path: string;
	page: ReturnType<typeof lazy> | (() => JSX.Element);
	exact: boolean;
}

export interface NavbarRouteData extends RouteData {
	name: string;
	displayInNavbar?: boolean;
}

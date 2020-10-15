import { lazy } from 'react';

export interface RouteData {
    path: string;
    name: string;
    page: ReturnType<typeof lazy>;
    exact?: boolean;
}

export const ROUTE_CONSTANTS: RouteData[] = [
    {
        path: '/',
        name: 'Home',
        page: lazy(() => import('./pages/home/Home')),
    },

    {
        path: '/about',
        name: 'About',
        page: lazy(() => import('./pages/about/About')),
    },

    {
        path: '/commands',
        name: 'Commands',
        page: lazy(() => import('./pages/commands/Commands')),
        exact: false,
    },
];

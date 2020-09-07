import type { Component } from 'react';
import About from './pages/about/About';
import App from './pages/app/App';
import Commands from './pages/commands/Commands';

export interface RouteData {
    path: string;
    name: string;
    page: typeof Component;
}

export const ROUTE_CONSTANTS: RouteData[] = [
    {
        path: '/',
        name: 'Home',
        page: App,
    },

    {
        path: '/about',
        name: 'About',
        page: About,
    },

    {
        path: '/commands',
        name: 'Commands',
        page: Commands,
    },
];

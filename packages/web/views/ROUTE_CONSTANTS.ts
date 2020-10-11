import type { Component } from 'react';
import About from './pages/about/About';
import Home from './pages/home/Home';
import Commands from './pages/commands/Commands';

export interface RouteData {
    path: string;
    name: string;
    page: typeof Component;
    exact?: boolean;
}

export const ROUTE_CONSTANTS: RouteData[] = [
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
        page: Commands,
        exact: false,
    },
];

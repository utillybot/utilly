import React from 'react';
import { useLocation } from 'react-router-dom';
import type { Location } from 'history';
import type { RouteData } from '../../routes';
import { routes } from '../../routes';
import NavbarHeader from './components/NavbarHeader';
import NavbarLinks from './components/NavbarLinks';
import NavbarSignIn from './components/NavbarSignIn';
import useMatchMedia from '../../hooks/useMatchMedia';
import CollapsableContent from '../Collapsable/CollapsableContent/CollapsableContent';
import Collapsable from '../Collapsable/Collapsable/Collapsable';
import { cmq } from '../../helpers';
import styles from './Navbar.module.scss';

const matchPage = (pageRoute: RouteData, location: Location) => {
	return pageRoute.exact == undefined || pageRoute.exact
		? location.pathname === pageRoute.path
		: location.pathname.startsWith(pageRoute.path);
};

const Navbar = (): JSX.Element => {
	const isDesktop = useMatchMedia(cmq(['min-width', [768, 'px']]));
	const location = useLocation();

	const linksData: Array<RouteData & { selected: boolean }> = [];
	let currentPage;

	for (const pageRoute of routes) {
		const selected = matchPage(pageRoute, location);
		if (selected) currentPage = pageRoute;
		linksData.push(Object.assign({ selected }, pageRoute));
	}
	const links = <NavbarLinks links={linksData} />;
	const header = <NavbarHeader currentPage={currentPage} />;
	const signIn = <NavbarSignIn />;

	const mobileNav = (
		<>
			{header}
			<Collapsable>
				{links}
				{signIn}
			</Collapsable>
		</>
	);

	const desktopNav = (
		<>
			{links}
			{header}
			{signIn}
		</>
	);

	return (
		<CollapsableContent>
			<nav className={styles.navbar}>{isDesktop ? desktopNav : mobileNav}</nav>
		</CollapsableContent>
	);
};

export default Navbar;

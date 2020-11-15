import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { Location } from 'history';
import type { RouteData } from '../../ROUTE_CONSTANTS';
import { ROUTE_CONSTANTS } from '../../ROUTE_CONSTANTS';
import styles from './Navbar.module.scss';
import NavbarHeader from './components/NavbarHeader';
import NavbarLinks from './components/NavbarLinks';
import NavbarSignIn from './components/NavbarSignIn';
import { mc } from '../../helpers';
import useMatchMedia from '../../hooks/useMatchMedia';

const matchPage = (pageRoute: RouteData, location: Location) => {
	return pageRoute.exact == undefined || pageRoute.exact
		? location.pathname === pageRoute.path
		: location.pathname.startsWith(pageRoute.path);
};

const Navbar = (): JSX.Element => {
	const [collapsed, setCollapsed] = useState(true);
	const isMobile = useMatchMedia('(max-width: 768px)');
	const location = useLocation();

	const linksData: Array<RouteData & { selected: boolean }> = [];
	let currentPage;

	for (const pageRoute of ROUTE_CONSTANTS) {
		const selected = matchPage(pageRoute, location);
		if (selected) currentPage = pageRoute;
		linksData.push(Object.assign({ selected }, pageRoute));
	}
	const links = <NavbarLinks links={linksData} setCollapsed={setCollapsed} />;
	const header = (
		<NavbarHeader
			currentPage={currentPage}
			collapsed={[collapsed, setCollapsed]}
		/>
	);
	const signIn = <NavbarSignIn setCollapsed={setCollapsed} />;

	if (isMobile) {
		return (
			<nav className={styles.mobile}>
				{header}
				<div
					className={mc(styles.collapsable, {
						[styles.collapsed]: collapsed,
					})}
				>
					{links}
					{signIn}
				</div>
			</nav>
		);
	} else {
		return (
			<nav>
				{links}
				{header}
				{signIn}
			</nav>
		);
	}
};

export default Navbar;

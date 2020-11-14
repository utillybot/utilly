import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { Location } from 'history';
import type { RouteData } from '../../ROUTE_CONSTANTS';
import { ROUTE_CONSTANTS } from '../../ROUTE_CONSTANTS';
import styles from './Navbar.module.scss';
import NavbarHeader from './components/NavbarHeader';
import NavbarLinks from './components/NavbarLinks';
import NavbarSignIn from './components/NavbarSignIn';
import { cn } from '../../helpers';

const matchPage = (pageRoute: RouteData, location: Location) => {
	return pageRoute.exact == undefined || pageRoute.exact
		? location.pathname === pageRoute.path
		: location.pathname.startsWith(pageRoute.path);
};

const Navbar = (): JSX.Element => {
	const [collapsed, setCollapsed] = useState(true);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	const location = useLocation();

	const updateMedia = () => {
		setIsMobile(window.innerWidth < 768);
	};

	useEffect(() => {
		window.addEventListener('resize', updateMedia);
		return () => window.removeEventListener('resize', updateMedia);
	});

	const linksData: Array<RouteData & { selected: boolean }> = [];

	let currentPage;

	for (const pageRoute of ROUTE_CONSTANTS) {
		const selected = matchPage(pageRoute, location);
		if (selected) currentPage = pageRoute;
		linksData.push(Object.assign({ selected }, pageRoute));
	}
	if (isMobile) {
		return (
			<nav className={styles.mobile}>
				<NavbarHeader
					collapsedState={[collapsed, setCollapsed]}
					currentPage={currentPage}
					isMobile={isMobile}
				/>
				<div
					className={cn(styles.collapsable, collapsed ? styles.collapsed : '')}
				>
					<NavbarLinks links={linksData} />
					<NavbarSignIn />
				</div>
			</nav>
		);
	} else {
		return (
			<nav>
				<NavbarLinks links={linksData} />
				<NavbarHeader
					collapsedState={[collapsed, setCollapsed]}
					currentPage={currentPage}
					isMobile={isMobile}
				/>
				<NavbarSignIn />
			</nav>
		);
	}
};

export default Navbar;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Location } from 'history';
import type { RouteData } from '../../ROUTE_CONSTANTS';
import { ROUTE_CONSTANTS } from '../../ROUTE_CONSTANTS';
import './Navbar.module.scss';

const generateSVG = (
	x: number,
	y: number,
	l: number,
	isCollapsed: string
): JSX.Element => {
	return (
		<path
			key={`${x},${y} ${l}`}
			styleName={`hamburger-line ${isCollapsed}`}
			d={`M ${x},${y} h${l}`}
		/>
	);
};

const matchPage = (pageRoute: RouteData, location: Location) => {
	return pageRoute.exact == undefined || pageRoute.exact
		? location.pathname === pageRoute.path
		: location.pathname.startsWith(pageRoute.path);
};

const Navbar = (): JSX.Element => {
	const [collapsed, setCollapsed] = useState(true);
	const location = useLocation();

	const navbarElements: JSX.Element[] = [];
	const isCollapsed = collapsed ? 'collapsed' : 'open';

	let currentPage;

	for (const pageRoute of ROUTE_CONSTANTS) {
		const matched = matchPage(pageRoute, location);
		if (matched) currentPage = pageRoute;
		navbarElements.push(
			<Link
				key={pageRoute.name}
				to={pageRoute.path}
				styleName={`item ${matched ? 'selected' : ''}`}
			>
				{pageRoute.name}
			</Link>
		);
	}

	return (
		<nav>
			<div styleName="container header">
				<div styleName="current">
					<h1>{currentPage?.name}</h1>
				</div>
				<div
					styleName="hamburger-container"
					onClick={() => setCollapsed(!collapsed)}
				>
					<button styleName="hamburger" aria-label="Toggle Navigation">
						<svg viewBox="0 0 10 10" width="40">
							{[
								[1, 2, 8],
								[1, 5, 8],
								[1, 8, 8],
							].map(i => generateSVG(i[0], i[1], i[2], isCollapsed))}
						</svg>
					</button>
				</div>
			</div>
			<div styleName={`container links collapsable ${isCollapsed}`}>
				{navbarElements}
			</div>
			<div styleName={`container signin collapsable ${isCollapsed}`}>
				<Link to="/" styleName="item">
					Sign in with Discord
				</Link>
			</div>
		</nav>
	);
};

export default Navbar;

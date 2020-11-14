import React from 'react';
import type { RouteData } from '../../../ROUTE_CONSTANTS';
import styles from './NavbarLinks.module.scss';
import NavbarItem from './NavbarItem';
import NavbarContainer from './NavbarContainer';

interface NavbarLinksProps {
	links: Array<RouteData & { selected: boolean }>;
}

const NavbarLinks = ({ links }: NavbarLinksProps): JSX.Element => {
	return (
		<NavbarContainer className={styles.links}>
			{links.map(pageRoute => (
				<NavbarItem
					key={pageRoute.name}
					to={pageRoute.path}
					className={pageRoute.selected ? styles.selected : ''}
				>
					{pageRoute.name}
				</NavbarItem>
			))}
		</NavbarContainer>
	);
};

export default NavbarLinks;

import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import type { RouteData } from '../../../ROUTE_CONSTANTS';
import styles from './NavbarLinks.module.scss';
import NavbarItem from './components/NavbarItem';
import NavbarContainer from './components/NavbarContainer';

interface NavbarLinksProps {
	links: Array<RouteData & { selected: boolean }>;
	setCollapsed: Dispatch<SetStateAction<boolean>>;
}

const NavbarLinks = ({
	setCollapsed,
	links,
}: NavbarLinksProps): JSX.Element => {
	return (
		<NavbarContainer className={styles.links}>
			{links.map(pageRoute => (
				<NavbarItem
					setCollapsed={setCollapsed}
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

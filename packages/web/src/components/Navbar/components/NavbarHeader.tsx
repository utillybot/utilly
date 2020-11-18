import React from 'react';
import type { RouteData } from '../../../ROUTE_CONSTANTS';
import styles from './NavbarHeader.module.scss';
import NavbarContainer from './components/NavbarContainer';
import useMatchMedia from '../../../hooks/useMatchMedia';
import { cmc } from '../../../helpers';
import Hamburger from '../../Collapsable/Hamburger/Hamburger';

interface NavbarHeaderProps {
	currentPage?: RouteData;
}

const NavbarHeader = ({ currentPage }: NavbarHeaderProps): JSX.Element => {
	const isDesktop = useMatchMedia(cmc(['min-width', [768, 'px']]));

	return (
		<NavbarContainer className={styles.header}>
			<h1>{currentPage?.name}</h1>
			{!isDesktop && (
				<NavbarContainer className={styles.hamburger}>
					<Hamburger />
				</NavbarContainer>
			)}
		</NavbarContainer>
	);
};

export default NavbarHeader;

import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import type { RouteData } from '../../../ROUTE_CONSTANTS';
import NavbarHamburger from './components/NavbarHamburger';
import styles from './NavbarHeader.module.scss';
import NavbarContainer from './components/NavbarContainer';
import useMatchMedia from '../../../hooks/useMatchMedia';

interface NavbarHeaderProps {
	currentPage?: RouteData;
	collapsed: [boolean, Dispatch<SetStateAction<boolean>>];
}

const NavbarHeader = ({
	collapsed,
	currentPage,
}: NavbarHeaderProps): JSX.Element => {
	const isMobile = useMatchMedia('(max-width: 768px)');

	return (
		<NavbarContainer className={styles.header}>
			<div className={styles.current}>
				<h1>{currentPage?.name}</h1>
			</div>
			{isMobile && <NavbarHamburger collapsedState={collapsed} />}
		</NavbarContainer>
	);
};

export default NavbarHeader;

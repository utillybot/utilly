import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import type { RouteData } from '../../../ROUTE_CONSTANTS';
import NavbarHamburger from './NavbarHamburger';
import styles from './NavbarHeader.module.scss';
import NavbarContainer from './NavbarContainer';

interface NavbarHeaderProps {
	currentPage?: RouteData;
	collapsedState: [boolean, Dispatch<SetStateAction<boolean>>];
	isMobile: boolean;
}

const NavbarHeader = ({
	currentPage,
	collapsedState,
	isMobile,
}: NavbarHeaderProps): JSX.Element => {
	return (
		<NavbarContainer className={styles.header}>
			<div className={styles.current}>
				<h1>{currentPage?.name}</h1>
			</div>
			{isMobile && <NavbarHamburger collapsedState={collapsedState} />}
		</NavbarContainer>
	);
};

export default NavbarHeader;

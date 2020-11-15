import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import styles from './NavbarSignIn.module.scss';
import NavbarItem from './components/NavbarItem';
import NavbarContainer from './components/NavbarContainer';

interface NavbarSignInProps {
	setCollapsed: Dispatch<SetStateAction<boolean>>;
}

const NavbarSignIn = ({ setCollapsed }: NavbarSignInProps): JSX.Element => {
	return (
		<NavbarContainer className={styles.signin}>
			<NavbarItem to="/" className={styles.item} setCollapsed={setCollapsed}>
				Sign in with Discord
			</NavbarItem>
		</NavbarContainer>
	);
};

export default NavbarSignIn;

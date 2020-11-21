import styles from './NavbarSignIn.module.scss';
import NavbarItem from './components/NavbarItem';
import NavbarContainer from './components/NavbarContainer';

const NavbarSignIn = (): JSX.Element => {
	return (
		<NavbarContainer className={styles.signin}>
			<NavbarItem to="/" className={styles.item}>
				Sign in with Discord
			</NavbarItem>
		</NavbarContainer>
	);
};

export default NavbarSignIn;

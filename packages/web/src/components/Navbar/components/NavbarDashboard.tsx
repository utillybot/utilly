import styles from './NavbarDashboard.module.scss';
import NavbarItem from './components/NavbarItem';
import NavbarContainer from './components/NavbarContainer';

const NavbarDashboard = (): JSX.Element => {
	return (
		<NavbarContainer className={styles.signin}>
			<NavbarItem to="/dashboard" className={styles.item}>
				Dashboard
			</NavbarItem>
		</NavbarContainer>
	);
};

export default NavbarDashboard;

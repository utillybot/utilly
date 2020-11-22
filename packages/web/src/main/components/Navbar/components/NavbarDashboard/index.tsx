import styles from './index.module.scss';
import NavbarLink from '../components/NavbarLink';
import NavbarContainer from '../components/NavbarContainer';

const NavbarDashboard = (): JSX.Element => {
	return (
		<NavbarContainer className={styles.dashboard}>
			<NavbarLink to="/dashboard" className={styles.item}>
				Dashboard
			</NavbarLink>
		</NavbarContainer>
	);
};

export default NavbarDashboard;

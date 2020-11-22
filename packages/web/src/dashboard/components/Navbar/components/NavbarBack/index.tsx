import styles from './index.module.scss';
import Button from '../../../../../components/Button';
import NavbarSection from '../components/NavbarSection';

const NavbarBack = (): JSX.Element => {
	return (
		<NavbarSection className={styles.back}>
			<Button to="/" className={styles.button}>
				ᐸ Back to main site
			</Button>
		</NavbarSection>
	);
};

export default NavbarBack;

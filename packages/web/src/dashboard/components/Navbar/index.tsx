import styles from './index.module.scss';
import NavbarBack from './components/NavbarBack';
import NavbarLinks from './components/NavbarLinks';
import NavbarProfile from './components/NavbarProfile';
import CollapsableContent from '../../../components/Collapsable/CollapsableContent';
import useMatchMedia from '../../../hooks/useMatchMedia';
import { cmq } from '../../../helpers';
import Collapsable from '../../../components/Collapsable/Collapsable';

const Navbar = (): JSX.Element => {
	const isDesktop = useMatchMedia(cmq(['min-width', [768, 'px']]));

	const back = <NavbarBack />;
	const links = <NavbarLinks />;
	const profile = <NavbarProfile />;
	return (
		<div className={styles.navbar}>
			<CollapsableContent>
				{isDesktop ? (
					<>
						{back}
						{links}
						{profile}
					</>
				) : (
					<>
						{profile}
						<Collapsable className={styles.collapsing}>
							{links}
							{back}
						</Collapsable>
					</>
				)}
			</CollapsableContent>
		</div>
	);
};

export default Navbar;

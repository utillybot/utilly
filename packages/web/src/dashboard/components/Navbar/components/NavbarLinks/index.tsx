import { protectedRoutes } from '../../../../routes';
import { NavLink } from 'react-router-dom';
import styles from './index.module.scss';
import useCollapsed from '../../../../../components/Collapsable/CollapsableContext/useCollapsed';
import NavbarSection from '../components/NavbarSection';

const NavbarLinks = (): JSX.Element => {
	const { setCollapsed } = useCollapsed();
	return (
		<NavbarSection className={styles.links}>
			{protectedRoutes.map(
				({ path, name, exact, displayInNavbar }) =>
					(displayInNavbar ?? true) && (
						<NavLink
							exact={exact ?? true}
							className={styles.item}
							activeClassName={styles.active}
							key={name}
							to={path}
							onClick={() => setCollapsed(true)}
						>
							{name}
						</NavLink>
					)
			)}
		</NavbarSection>
	);
};

export default NavbarLinks;

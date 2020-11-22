import styles from './index.module.scss';
import NavbarLink from '../components/NavbarLink';
import NavbarContainer from '../components/NavbarContainer';
import type { NavbarRouteData } from '../../../../../components/Routes/types';

interface NavbarLinksProps {
	links: Array<NavbarRouteData & { selected: boolean }>;
}

const NavbarLinks = ({ links }: NavbarLinksProps): JSX.Element => {
	return (
		<NavbarContainer className={styles.links}>
			{links.map(pageRoute => (
				<NavbarLink
					key={pageRoute.name}
					to={pageRoute.path}
					className={pageRoute.selected ? styles.selected : ''}
				>
					{pageRoute.name}
				</NavbarLink>
			))}
		</NavbarContainer>
	);
};

export default NavbarLinks;

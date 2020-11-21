import type { RouteData } from '../../../routes';
import styles from './NavbarLinks.module.scss';
import NavbarItem from './components/NavbarItem';
import NavbarContainer from './components/NavbarContainer';

interface NavbarLinksProps {
	links: Array<RouteData & { selected: boolean }>;
}

const NavbarLinks = ({ links }: NavbarLinksProps): JSX.Element => {
	return (
		<NavbarContainer className={styles.links}>
			{links.map(pageRoute => (
				<NavbarItem
					key={pageRoute.name}
					to={pageRoute.path}
					className={pageRoute.selected ? styles.selected : ''}
				>
					{pageRoute.name}
				</NavbarItem>
			))}
		</NavbarContainer>
	);
};

export default NavbarLinks;

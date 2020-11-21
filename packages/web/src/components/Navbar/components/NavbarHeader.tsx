import type { RouteData } from '../../../routes';
import styles from './NavbarHeader.module.scss';
import NavbarContainer from './components/NavbarContainer';
import useMatchMedia from '../../../hooks/useMatchMedia';
import { cmq } from '../../../helpers';
import Hamburger from '../../Collapsable/Hamburger/Hamburger';

interface NavbarHeaderProps {
	currentPage?: RouteData;
}

const NavbarHeader = ({ currentPage }: NavbarHeaderProps): JSX.Element => {
	const isDesktop = useMatchMedia(cmq(['min-width', [768, 'px']]));

	return (
		<NavbarContainer className={styles.header}>
			<h1>{currentPage?.name}</h1>
			{!isDesktop && (
				<NavbarContainer className={styles.hamburger}>
					<Hamburger />
				</NavbarContainer>
			)}
		</NavbarContainer>
	);
};

export default NavbarHeader;

import { useLocation } from 'react-router-dom';
import type { Location } from 'history';
import { routes } from '../../routes';
import NavbarHeader from './components/NavbarHeader';
import NavbarLinks from './components/NavbarLinks';
import NavbarDashboard from './components/NavbarDashboard';
import useMatchMedia from '../../../hooks/useMatchMedia';
import CollapsableContent from '../../../components/Collapsable/CollapsableContent';
import Collapsable from '../../../components/Collapsable/Collapsable';
import { cmq } from '../../../helpers';
import styles from './index.module.scss';
import type { NavbarRouteData } from '../../../components/Routes/types';

const matchPage = (pageRoute: NavbarRouteData, location: Location) => {
	return pageRoute.exact == undefined || pageRoute.exact
		? location.pathname === pageRoute.path
		: location.pathname.startsWith(pageRoute.path);
};

const Navbar = (): JSX.Element => {
	const isDesktop = useMatchMedia(cmq(['min-width', [768, 'px']]));
	const location = useLocation();

	const linksData: Array<NavbarRouteData & { selected: boolean }> = [];
	let currentPage;

	for (const pageRoute of routes) {
		const selected = matchPage(pageRoute, location);
		if (selected) currentPage = pageRoute;
		linksData.push(Object.assign({ selected }, pageRoute));
	}
	const links = <NavbarLinks links={linksData} />;
	const header = <NavbarHeader currentPage={currentPage} />;
	const dashboard = <NavbarDashboard />;

	const mobileNav = (
		<>
			{header}
			<Collapsable>
				{links}
				{dashboard}
			</Collapsable>
		</>
	);

	const desktopNav = (
		<>
			{links}
			{header}
			{dashboard}
		</>
	);

	return (
		<CollapsableContent>
			<nav className={styles.navbar}>{isDesktop ? desktopNav : mobileNav}</nav>
		</CollapsableContent>
	);
};

export default Navbar;

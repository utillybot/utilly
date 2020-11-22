import { Route } from 'react-router-dom';
import type { RouteData } from './types';

const parseRoutes = (routes: RouteData[]): JSX.Element[] => {
	return routes.map(({ exact, path, page }) => (
		<Route exact={exact} key={path} path={path} component={page} />
	));
};

export default parseRoutes;

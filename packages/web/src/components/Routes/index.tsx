import { Route } from 'react-router-dom';
import type { RouteData } from './types';
import { Suspense } from 'react';
import Spinner from '../Spinner';

interface RoutesProps {
	routes: RouteData[];
}

const Routes = ({ routes }: RoutesProps): JSX.Element => {
	return (
		<Suspense fallback={<Spinner />}>
			{routes.map(({ exact, path, page }) => (
				<Route exact={exact} key={path} path={path} component={page} />
			))}
		</Suspense>
	);
};

export default Routes;

import React, { Suspense } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { ROUTE_CONSTANTS } from '../../ROUTE_CONSTANTS';
import './Routes.module.scss';
import Spinner from '../Spinner/Spinner';

const Routes = (): JSX.Element => {
	const location = useLocation();

	const routes: JSX.Element[] = [];
	for (const pageRoute of ROUTE_CONSTANTS) {
		routes.push(
			<Route
				exact={pageRoute.exact ?? true}
				key={pageRoute.name}
				path={pageRoute.path}
				component={pageRoute.page}
			/>
		);
	}
	return (
		<div styleName="page">
			<Suspense fallback={Spinner}>
				<Switch location={location}>{routes}</Switch>
			</Suspense>
		</div>
	);
};

export default Routes;

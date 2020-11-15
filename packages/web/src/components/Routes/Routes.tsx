import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ROUTE_CONSTANTS } from '../../ROUTE_CONSTANTS';
import Spinner from '../Spinner/Spinner';
import { CSSTransition } from 'react-transition-group';
import styles from '../../styles/PageTransitions.module.scss';

const Routes = (): JSX.Element => {
	return (
		<Suspense fallback={Spinner}>
			{ROUTE_CONSTANTS.map(({ exact, name, path, page }) => (
				<Route exact={exact ?? true} key={name} path={path}>
					{({ match }) => (
						<CSSTransition
							in={match != null}
							timeout={800}
							classNames={{ ...styles }}
							unmountOnExit
						>
							{page}
						</CSSTransition>
					)}
				</Route>
			))}
		</Suspense>
	);
};

export default Routes;

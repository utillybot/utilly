import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { routes } from '../../routes';
import Spinner from '../Spinner/Spinner';
import { CSSTransition } from 'react-transition-group';
import styles from '../../styles/PageTransitions.module.scss';
import PreloadLazyComponents from '../PreloadLazyComponents/PreloadLazyComponents';

const Routes = (): JSX.Element => {
	return (
		<Suspense fallback={<Spinner />}>
			<PreloadLazyComponents />

			{routes.map(({ exact, name, path, page }) => (
				<Route exact={exact ?? true} key={name} path={path}>
					{({ match }) => {
						const Page = page;
						return (
							<CSSTransition
								in={match != null}
								timeout={800}
								classNames={{ ...styles }}
								unmountOnExit
							>
								<Page />
							</CSSTransition>
						);
					}}
				</Route>
			))}
		</Suspense>
	);
};

export default Routes;

import { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { routes } from '../../routes';
import Spinner from '../Spinner/Spinner';
import PreloadLazyComponents from '../PreloadLazyComponents/PreloadLazyComponents';

const Routes = (): JSX.Element => {
	return (
		<Suspense fallback={<Spinner />}>
			<PreloadLazyComponents />

			{routes.map(({ exact, name, path, page }) => (
				<Route exact={exact ?? true} key={name} path={path} component={page} />
			))}
		</Suspense>
	);
};

export default Routes;

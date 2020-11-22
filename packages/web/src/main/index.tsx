import Navbar from './components/Navbar';
import Routes from '../components/Routes';
import { routes } from './routes';
import PreloadLazyComponents from '../components/PreloadLazyComponents';
import { Suspense } from 'react';
import Spinner from '../components/Spinner';

export const Main = (): JSX.Element => {
	return (
		<Suspense fallback={<Spinner />}>
			<Navbar />
			<PreloadLazyComponents />
			<Routes routes={routes} />
		</Suspense>
	);
};

export default Main;

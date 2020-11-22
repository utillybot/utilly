import { Suspense, lazy, StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import Spinner from './components/Spinner';

Sentry.init({
	dsn:
		'https://506f2511da8049e082eca7dd965ac2b7@o119585.ingest.sentry.io/5514879',
});

const Main = lazy(() => import('./main'));
const Dashboard = lazy(() => import('./dashboard'));

ReactDOM.render(
	<StrictMode>
		<Suspense fallback={<Spinner />}>
			<BrowserRouter>
				<Switch>
					<Route path="/dashboard" component={Dashboard} />
					<Route path="/" component={Main} />
				</Switch>
			</BrowserRouter>
		</Suspense>
	</StrictMode>,
	document.getElementById('root')
);

import { Suspense, lazy, StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Spinner from './components/Spinner';

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

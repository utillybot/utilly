import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Routes from './components/Routes/Routes';
import * as Sentry from '@sentry/react';

Sentry.init({
	dsn:
		'https://506f2511da8049e082eca7dd965ac2b7@o119585.ingest.sentry.io/5514879',
});

ReactDOM.render(
	<StrictMode>
		<BrowserRouter>
			<Navbar />
			<Routes />
		</BrowserRouter>
	</StrictMode>,
	document.getElementById('root')
);

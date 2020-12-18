import ProtectedDashboard from './components/ProtectedDashboard';
import { Switch, Route } from 'react-router-dom';
import { staticRoutes } from './routes';
import parseRoutes from '../components/Routes';
import CacheStorageContext from './components/CacheStorageContext';
import { useRef } from 'react';

const Dashboard = (): JSX.Element => {
	const cacheRef = useRef({});

	return (
		<Switch>
			<CacheStorageContext.Provider value={cacheRef.current}>
				{parseRoutes(staticRoutes)}
				<Route component={ProtectedDashboard} />
			</CacheStorageContext.Provider>
		</Switch>
	);
};

export default Dashboard;

import ProtectedDashboard from './components/ProtectedDashboard';
import { Switch, Route } from 'react-router-dom';
import { staticRoutes } from './routes';
import parseRoutes from '../components/Routes';

const Dashboard = (): JSX.Element => {
	return (
		<Switch>
			{parseRoutes(staticRoutes)}
			<Route component={ProtectedDashboard} />
		</Switch>
	);
};

export default Dashboard;

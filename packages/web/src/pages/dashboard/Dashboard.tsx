import Guilds from './pages/guilds/Guilds';
import { Route, Redirect } from 'react-router-dom';
import { getCookie } from '../../helpers';
import DashboardHome from './pages/home/DashboardHome';
import DashboardError from './pages/error/DashboardError';

const Dashboard = (): JSX.Element => {
	// prev cookie exists after oauth2 flow
	const prev = getCookie('prev');
	if (prev != null) {
		document.cookie =
			'prev=; expires=Thu, 01 Jan 1970 00:00:00 UTC; max-age=0; path=/;';
		if (location.pathname != '/dashboard/error') return <Redirect to={prev} />;
	}

	return (
		<>
			<Route path="/dashboard/guilds">
				<Guilds />
			</Route>
			<Route exact path="/dashboard/error">
				<DashboardError />
			</Route>
			<Route exact path="/dashboard">
				<DashboardHome />
			</Route>
		</>
	);
};

export default Dashboard;

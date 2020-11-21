import Guilds from './pages/Guilds/Guilds';
import { Route, Redirect } from 'react-router-dom';
import { getCookie } from '../../helpers';
import Button from '../../components/Button/Button';
import styles from './Dashboard.module.scss';
import Page from '../../components/Page/Page';

const Dashboard = (): JSX.Element => {
	// prev cookie exists after oauth2 flow
	const prev = getCookie('prev');
	if (prev != null) {
		document.cookie =
			'prev=; expires=Thu, 01 Jan 1970 00:00:00 UTC; max-age=0; path=/;';
		return <Redirect to={prev} />;
	}

	return (
		<>
			<Route path="/dashboard/guilds">
				<Guilds />
			</Route>
			<Route exact path="/dashboard">
				<Page>
					<Button className={styles.button} to="/dashboard/guilds">
						Go to Servers
					</Button>
				</Page>
			</Route>
		</>
	);
};

export default Dashboard;

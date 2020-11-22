import { Redirect } from 'react-router-dom';
import { getCookie } from '../helpers';
import Routes from '../components/Routes';
import { routes } from './routes';
import Navbar from './components/Navbar';
import { useEffect, useState } from 'react';
import UserContext from './components/UserContext';

const Dashboard = (): JSX.Element => {
	const [user, setUser] = useState<User | undefined>(undefined);
	useEffect(() => {
		fetch('/dashboard/api/users')
			.then(res => {
				if (res.status == 401) {
					document.cookie = `prev=${location.pathname}; path=/;`;
					window.location.assign('/dashboard/login');
				}
				return res.json();
			})
			.then(setUser);
	}, []);

	// prev cookie exists after oauth2 flow
	const prev = getCookie('prev');
	if (prev != null) {
		document.cookie =
			'prev=; expires=Thu, 01 Jan 1970 00:00:00 UTC; max-age=0; path=/;';
		if (location.pathname != '/dashboard/error') return <Redirect to={prev} />;
	}

	return (
		<UserContext.Provider value={user}>
			<Navbar />
			<Routes routes={routes} />
		</UserContext.Provider>
	);
};

export default Dashboard;

import { useEffect, useState } from 'react';
import UserContext from '../UserContext';
import Navbar from '../Navbar';
import { protectedRoutes } from '../../routes';
import parseRoutes from '../../../components/Routes';

const ProtectedDashboard = (): JSX.Element => {
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

	if (!user) return <></>;

	return (
		<UserContext.Provider value={user}>
			<Navbar />
			{parseRoutes(protectedRoutes)}
		</UserContext.Provider>
	);
};

export default ProtectedDashboard;

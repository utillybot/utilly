import UserContext from '../UserContext';
import Navbar from '../Navbar';
import { protectedRoutes } from '../../routes';
import parseRoutes from '../../../components/Routes';
import useProtectedFetch from '../../hooks/useProtectedFetch';
import type { User } from '../../types';

const ProtectedDashboard = (): JSX.Element => {
	const fetchResult = useProtectedFetch<User>('/dashboard/api/users');

	if (!fetchResult[0]) return fetchResult[1];

	const user = fetchResult[1];

	return (
		<UserContext.Provider value={user}>
			<Navbar />
			{parseRoutes(protectedRoutes)}
		</UserContext.Provider>
	);
};

export default ProtectedDashboard;

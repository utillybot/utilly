import { useContext } from 'react';
import UserContext from './index';

const useUserContext = (): User | undefined => {
	const context = useContext(UserContext);
	return context;
};

export default useUserContext;

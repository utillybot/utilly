import { useContext } from 'react';
import UserContext from './index';

const useUserContext = (): User | undefined => {
	return useContext(UserContext);
};

export default useUserContext;

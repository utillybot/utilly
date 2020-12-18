import { useContext } from 'react';
import UserContext from './index';
import type { User } from '../../types';

const useUserContext = (): User | undefined => {
	return useContext(UserContext);
};

export default useUserContext;

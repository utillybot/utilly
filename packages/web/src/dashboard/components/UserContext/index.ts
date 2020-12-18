import { createContext } from 'react';
import type { User } from '../../types';

const UserContext = createContext<User | undefined>(undefined);

export default UserContext;

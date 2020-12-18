import { useContext } from 'react';
import CacheStorageContext from './index';

const useCacheStorage = (): Record<string, unknown> => {
	return useContext(CacheStorageContext);
};

export default useCacheStorage;

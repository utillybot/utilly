import { createContext } from 'react';

const CacheStorageContext = createContext<Record<string, unknown>>({});

export default CacheStorageContext;

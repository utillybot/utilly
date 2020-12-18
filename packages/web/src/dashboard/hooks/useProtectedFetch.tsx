import useAuthorization from '../../hooks/useAuthorization';
import { useEffect, useRef, useState } from 'react';
import Login from '../pages/login';
import Spinner from '../../components/Spinner';
import useCacheStorage from '../components/CacheStorageContext/useCacheStorage';

const useProtectedFetch = <T,>(
	url: string,
	shouldCache = false
): [false, JSX.Element] | [true, T] => {
	const cache = useCacheStorage();

	const [started, start, done] = useAuthorization();
	const [result, setResult] = useState<T | undefined>();

	useEffect(() => {
		if (shouldCache && cache[url]) {
			setResult(cache[url] as T);
		} else {
			fetch(url)
				.then(res => {
					if (res.status == 401) {
						start();
						return undefined;
					}
					return res.json();
				})
				.then(res => {
					if (shouldCache) cache[url] = res;
					setResult(res);
				});
		}
	}, [url, start, done, shouldCache]);

	if (started && !done) return [false, <Login key="0" />];
	if (!result) return [false, <Spinner key="0" />];

	return [true, result];
};

export default useProtectedFetch;

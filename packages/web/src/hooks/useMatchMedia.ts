import { useEffect, useState } from 'react';

const useMatchMedia = (mediaQuery: string): boolean => {
	const matched = window.matchMedia(mediaQuery);
	const [isMobile, setIsMobile] = useState(matched.matches);
	const updateMedia = (e: MediaQueryListEvent) => {
		setIsMobile(e.matches);
	};

	useEffect(() => {
		matched.addEventListener('change', updateMedia);
		return () => matched.removeEventListener('change', updateMedia);
	});

	return isMobile;
};

export default useMatchMedia;

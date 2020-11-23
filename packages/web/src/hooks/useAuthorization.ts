import { useEffect } from 'react';
import { deleteCookie, getCookie } from '../helpers';

const useAuthorization = (
	loginURL: string,
	fallbackURL: string,
	successURL: string,
	start = true,
	failureURL?: string
): void => {
	useEffect(() => {
		if (!start) return;
		// Launch a popup to authenticate
		const popup = window.open(loginURL, '_blank', 'width=500,height=750');

		// If the popup failed to launch, go into full screen authorization with the fallback
		if (popup == null) {
			window.location.assign(fallbackURL);
		} else {
			// Poll every 100 ms checking if the popup is closed
			const pollTimer = setInterval(() => {
				if (popup.closed) {
					clearInterval(pollTimer);

					// Expect an error cookie if there was an error and don't do anything
					if (getCookie('error')) {
						// If a failure URL was specified, go there. Expect that the error cookie will be used there
						if (failureURL) {
							window.location.assign(failureURL);
						} else {
							deleteCookie('error');
						}
						// Expect a successful login if there is a success cookie
					} else if (getCookie('success')) {
						deleteCookie('success');
						// Go to the previous page if there was one or to the default success
						const prev = getCookie('prev');
						if (prev) {
							deleteCookie('prev');
							window.location.assign(prev);
						} else {
							window.location.assign(successURL);
						}
						// If there was no cookie response from the server, go to the failure url.
					} else if (failureURL) window.location.assign(failureURL);
				}
			}, 100);
		}
	}, [fallbackURL, successURL, loginURL, failureURL, start]);
};

export default useAuthorization;

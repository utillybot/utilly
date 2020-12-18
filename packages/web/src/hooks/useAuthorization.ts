import { useCallback, useEffect, useState } from 'react';

const useAuthorization = (): [boolean, () => void, boolean] => {
	const [start, setStart] = useState(false);
	const [done, setDone] = useState(false);

	useEffect(() => {
		if (!start) return;
		// Launch a popup to authenticate
		const popup = window.open(
			'/dashboard/authorize',
			'_blank',
			'width=500,height=750'
		);

		// Poll every 100 ms checking if the popup is closed
		const pollTimer = setInterval(() => {
			if (popup && popup.closed) {
				clearInterval(pollTimer);

				// Expect an error cookie if there was an error and don't do anything
				/*if (getCookie('error')) {
						// If a failure URL was specified, go there. Expect that the error cookie will be used there
						if (failureURL) {
							window.location.assign(failureURL);
						} else {
							deleteCookie('error');
						}
						// Expect a successful login if there is a success cookie
					} else*/

				// If there was no cookie response from the server, go to the failure url.

				setDone(true);
			}
		}, 100);
	}, [start]);

	return [start, useCallback(() => setStart(true), [setStart]), done];
};

export default useAuthorization;

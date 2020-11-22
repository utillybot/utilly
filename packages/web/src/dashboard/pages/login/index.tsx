import { useEffect } from 'react';
import { getCookie } from '../../../helpers';

const Login = (): JSX.Element => {
	useEffect(() => {
		const loginWindow = window.open(
			'/dashboard/authorize',
			'_blank',
			'width=500,height=750'
		);
		if (loginWindow == null) {
			window.location.assign('/dashboard/oldLogin');
		} else {
			const pollTimer = setInterval(() => {
				if (loginWindow.closed) {
					clearInterval(pollTimer);
					if (getCookie('error')) {
						window.location.assign('/dashboard/error');
					} else {
						window.location.assign('/dashboard');
					}
				}
			}, 100);
		}
	}, []);

	return <h1>Please Login to continue</h1>;
};

export default Login;

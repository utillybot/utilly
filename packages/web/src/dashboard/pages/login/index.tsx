import useAuthorization from '../../../hooks/useAuthorization';

const Login = (): JSX.Element => {
	useAuthorization('/dashboard/authorize', '/dashboard/oldLogin', '/dashboard');
	return <h1>Please Login to continue</h1>;
};

export default Login;

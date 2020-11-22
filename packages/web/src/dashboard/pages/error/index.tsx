import Button from '../../../components/Button';
import styles from './index.module.scss';
import Page from '../../components/Page';

const Error = (): JSX.Element => {
	return (
		<Page>
			<h1>An error happened during the login process.</h1>
			<Button className={styles.button} to="/dashboard">
				Go to Dashboard
			</Button>
		</Page>
	);
};

export default Error;

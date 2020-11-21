import Page from '../../../../components/Page/Page';
import Button from '../../../../components/Button/Button';
import styles from './DashboardError.module.scss';

const DashboardError = (): JSX.Element => {
	return (
		<Page>
			<h1>An error happened during the login process.</h1>
			<Button className={styles.button} to="/dashboard">
				Go to Dashboard
			</Button>
		</Page>
	);
};

export default DashboardError;

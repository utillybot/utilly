import React from 'react';
import logo from '../../../assets/logo.png';
import styles from './Home.module.scss';
import Page from '../../components/Page/Page';

const Home = (): JSX.Element => {
	return (
		<Page className={styles.page}>
			<img src={logo} alt="Utilly Logo" />
			<h1>Utilly</h1>
			<h2>The tool for the job</h2>
		</Page>
	);
};

export default Home;

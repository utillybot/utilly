import React from 'react';
import './Home.module.scss';

const Home = (): JSX.Element => {
	return (
		<div styleName="page">
			<header>
				<img src="/static/logo.png" alt="Utilly Logo" />
				<h1>Utilly</h1>
				<h2>The tool for the job</h2>
			</header>
		</div>
	);
};

export default Home;

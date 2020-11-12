import React from 'react';
import 'regenerator-runtime/runtime';
import './About.module.scss';
import StatsContainer from './components/StatsContainer';

const About = (): JSX.Element => {
	return (
		<div styleName="page">
			<header>
				<h1>
					Utilly is a modular bot that contains many tools for server owners,
					while also being customizable.
				</h1>
			</header>
			<div styleName="stats">
				<div styleName="header">
					<h2>Statistics</h2>
					<h3>These statistics update every 30 seconds</h3>
				</div>
				<div styleName="container">
					<StatsContainer />
				</div>
			</div>
		</div>
	);
};

export default About;

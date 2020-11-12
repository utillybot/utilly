import React from 'react';
import 'regenerator-runtime/runtime';
import './About.scss';
import StatsContainer from './components/StatsContainer';

const About = (): JSX.Element => {
    return (
        <div className="page-about">
            <header>
                <h1>
                    Utilly is a modular bot that contains many tools for server
                    owners, while also being customizable.
                </h1>
            </header>
            <div className="stats">
                <div className="stats-header">
                    <h2>Statistics</h2>
                    <h3>These statistics update every 30 seconds</h3>
                </div>
                <div className="stats-container">
                    <StatsContainer />
                </div>
            </div>
        </div>
    );
};

export default About;

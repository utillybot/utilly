import React, { Component } from 'react';
import 'regenerator-runtime/runtime';
import './About.sass';
import StatsContainer from './components/StatsContainer';

class About extends Component {
    render(): JSX.Element {
        return (
            <React.Fragment>
                <div className="about">
                    <header>
                        <h1>
                            Utilly is a modular bot that contains many tools for
                            server owners, while also being customizable.
                        </h1>
                    </header>
                    <div className="stats">
                        <div className="stats-header">
                            <h2 className="stats-header-title">Statistics</h2>
                            <h3 className="stats-header-subtitle">
                                These statistics update every 30 seconds
                            </h3>
                        </div>
                        <div className="stats-container">
                            <StatsContainer />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default About;

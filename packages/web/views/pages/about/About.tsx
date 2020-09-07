import React, { Component } from 'react';
import type { RouteComponentProps } from 'react-router-dom';

class About extends Component<RouteComponentProps> {
    render(): JSX.Element {
        return (
            <div>
                <header>
                    <h1>About</h1>
                    <h2>Utilly is a multipurpose bot that can do a lot</h2>
                </header>
                <div>
                    <h2>Stats</h2>
                </div>
            </div>
        );
    }
}

export default About;

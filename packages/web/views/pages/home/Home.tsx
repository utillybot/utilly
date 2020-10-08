import React, { Component } from 'react';
import './Home.sass';

class Home extends Component {
    render(): JSX.Element {
        return (
            <React.Fragment>
                <header className="home-header">
                    <img
                        className="home-logo"
                        src="./logo.png"
                        alt="Utilly Logo"
                    />
                    <h1>Utilly</h1>
                    <h2>The tool for the job</h2>
                </header>
            </React.Fragment>
        );
    }
}

export default Home;

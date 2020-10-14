import React, { Component } from 'react';
import './Home.sass';

class Home extends Component {
    render(): JSX.Element {
        return (
            <React.Fragment>
                <div className="page-home">
                    <header>
                        <img src="/static/logo.png" alt="Utilly Logo" />
                        <h1>Utilly</h1>
                        <h2>The tool for the job</h2>
                    </header>
                </div>
            </React.Fragment>
        );
    }
}

export default Home;

import React from 'react';
import './Home.sass';

const Home = (): JSX.Element => {
    return (
        <div className="page-home">
            <header>
                <img src="/static/logo.png" alt="Utilly Logo" />
                <h1>Utilly</h1>
                <h2>The tool for the job</h2>
            </header>
        </div>
    );
};

export default Home;

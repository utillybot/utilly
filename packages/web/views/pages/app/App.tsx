import React, { Component } from 'react';
import './App.sass';

class App extends Component {
    render(): JSX.Element {
        return (
            <React.Fragment>
                <header className="App-header">
                    <img className="App-logo" src="./logo.png" />
                    <h1>Utilly</h1>
                    <h2>The tool for the job</h2>
                </header>
            </React.Fragment>
        );
    }
}

export default App;

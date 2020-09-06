import React, { Component } from 'react';
import Navbar from '../../components/Navbar';
import './App.css';

class App extends Component {
    render(): JSX.Element {
        return (
            <div className="App">
                <header className="App-header">
                    <Navbar selected="Home"></Navbar>
                    <img className="App-logo" src="./logo.png"></img>
                    <h1>Utilly</h1>
                    <h2>The tool for the job</h2>
                </header>
            </div>
        );
    }
}

export default App;

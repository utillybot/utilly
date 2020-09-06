import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import './index.css';
import About from './pages/about/About';
import App from './pages/app/App';
import Commands from './pages/commands/Commands';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Navbar />
            <Switch>
                <div className="app">
                    <Route path="/" exact component={App} />
                    <Route path="/commands" exact component={Commands} />
                    <Route path="/about" exact component={About} />
                </div>
            </Switch>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

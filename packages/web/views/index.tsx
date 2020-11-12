import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Routes from './components/Routes/Routes';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Navbar />
            <Routes />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

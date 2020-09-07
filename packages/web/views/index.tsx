import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import './index.css';
import { ROUTE_CONSTANTS } from './ROUTE_CONSTANTS';

const routes: JSX.Element[] = [];
for (const pageRoute of ROUTE_CONSTANTS) {
    routes.push(
        <Route path={pageRoute.path} exact component={pageRoute.page} />
    );
}

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Navbar />
            <Switch>
                <div className="app">{routes}</div>
            </Switch>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

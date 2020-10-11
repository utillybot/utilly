import React, { Component } from 'react';
import './Commands.sass';
import type { RouteComponentProps } from 'react-router-dom';
import { Switch, withRouter, BrowserRouter, Route } from 'react-router-dom';
import CommandModulesPage from './pages/CommandModulesPage/CommandModulesPage';
import CommandModulePage from './pages/CommandModulePage/CommandModulePage';
import CommandPage from './pages/CommandPage/CommandPage';

class Commands extends Component<RouteComponentProps> {
    render(): JSX.Element {
        return (
            <div className="page-commands">
                <header>
                    <h2>View all the commands for Utilly!</h2>{' '}
                </header>
                <BrowserRouter>
                    <Switch>
                        <Route
                            exact
                            path={'/commands'}
                            component={CommandModulesPage}
                        />

                        <Route
                            exact
                            path={'/commands/:module'}
                            component={CommandModulePage}
                        />

                        <Route
                            exact
                            path={'/commands/:module/:command'}
                            component={CommandPage}
                        />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default withRouter(Commands);

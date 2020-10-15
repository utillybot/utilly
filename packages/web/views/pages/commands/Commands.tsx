import React, { Suspense, Component } from 'react';
import './Commands.sass';
import type { RouteComponentProps } from 'react-router-dom';
import { Switch, withRouter, BrowserRouter, Route } from 'react-router-dom';
import CommandModulesPage from './pages/CommandModulesPage/CommandModulesPage';
import CommandModulePage from './pages/CommandModulePage/CommandModulePage';
import CommandPage from './pages/CommandPage/CommandPage';
import { get } from '../../API';
import Spinner from '../../components/Spinner/Spinner';

const commands = get().commands;

class Commands extends Component<RouteComponentProps> {
    render(): JSX.Element {
        return (
            <Suspense fallback={<Spinner />}>
                <div className="page-commands">
                    <header>
                        <h2>View all the commands for Utilly!</h2>
                    </header>
                    <BrowserRouter>
                        <Switch>
                            <Route
                                exact
                                path={'/commands'}
                                component={() => (
                                    <CommandModulesPage resource={commands} />
                                )}
                            />

                            <Route
                                exact
                                path={'/commands/:module'}
                                component={() => (
                                    <CommandModulePage resource={commands} />
                                )}
                            />

                            <Route
                                exact
                                path={'/commands/:module/:command'}
                                component={() => (
                                    <CommandPage resource={commands} />
                                )}
                            />
                        </Switch>
                    </BrowserRouter>
                </div>
            </Suspense>
        );
    }
}

export default withRouter(Commands);

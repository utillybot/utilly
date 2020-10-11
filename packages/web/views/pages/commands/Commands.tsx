import React, { Component } from 'react';
import './Commands.sass';
import type { RouteComponentProps } from 'react-router-dom';
import { Switch, withRouter, BrowserRouter, Route } from 'react-router-dom';
import CommandModulesPage from './pages/CommandModulesPage/CommandModulesPage';
import CommandModulePage from './pages/CommandModulePage/CommandModulePage';
import CommandPage from './pages/CommandPage/CommandPage';

export interface CommandModule {
    name: string;
    description: string;
    commands: Command[];
}

export interface Command {
    name: string;
    description: string;
    usage: string;
    aliases: string[];
}

interface CommandsState {
    commandModules: CommandModule[];
}

class Commands extends Component<RouteComponentProps, CommandsState> {
    constructor(props: RouteComponentProps) {
        super(props);
        this.state = { commandModules: [] };
    }
    async componentDidMount(): Promise<void> {
        const result = await (await fetch('/api/commands')).json();
        this.setState({
            commandModules: result.commandModules,
        });
    }

    render(): JSX.Element {
        return (
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
                                <CommandModulesPage
                                    commandModules={this.state.commandModules}
                                />
                            )}
                        />

                        <Route
                            exact
                            path={'/commands/:module'}
                            component={() => (
                                <CommandModulePage
                                    commandModules={this.state.commandModules}
                                />
                            )}
                        />

                        <Route
                            exact
                            path={'/commands/:module/:command'}
                            component={() => (
                                <CommandPage
                                    commandModules={this.state.commandModules}
                                />
                            )}
                        />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default withRouter(Commands);

import React, { Component } from 'react';
import CommandModuleTile from './components/CommandModuleTile';
import './CommandModulesPage.sass';

interface CommandModule {
    name: string;
    description: string;
}

interface CommandModulesPageState {
    commandModules: CommandModule[];
}

class CommandModulesPage extends Component<unknown, CommandModulesPageState> {
    constructor(props: unknown) {
        super(props);
        this.state = {
            commandModules: [],
        };
    }

    async componentDidMount(): Promise<void> {
        const result = await (await fetch('/api/commands')).json();
        this.setState({
            commandModules: result.commandModules,
        });
    }

    render(): JSX.Element {
        return (
            <div
                className={`command-module-container ${
                    this.state.commandModules.length == 0 ? 'loading' : ''
                }`}
            >
                {this.state.commandModules.length == 0 ? (
                    <h1 className="loading">Loading...</h1>
                ) : (
                    this.state.commandModules.map(module => (
                        <CommandModuleTile
                            key={module.name}
                            commandModule={module}
                        />
                    ))
                )}
            </div>
        );
    }
}

export default CommandModulesPage;

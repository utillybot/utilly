import React, { Component } from 'react';
import './Commands.sass';

interface CommandsState {
    commandModules: string[];
}

class Commands extends Component<unknown, CommandsState> {
    constructor(props: unknown) {
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
            <div className="commands">
                <div className="header">
                    <h2>View all the commands for Utilly!</h2>{' '}
                </div>
                <div className="command-module-container">
                    <React.Suspense fallback="Loading..."></React.Suspense>
                </div>
            </div>
        );
    }
}

export default Commands;

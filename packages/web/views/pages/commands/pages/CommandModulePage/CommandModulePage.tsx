import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import type { RouteComponentProps } from 'react-router-dom';
import CommandTile from './components/CommandTile';
import './CommandModulePage.sass';

interface Command {
    name: string;
    description: string;
}

interface CommandModulePageState {
    commands: Command[];
}

class CommandModulePage extends Component<
    RouteComponentProps,
    CommandModulePageState
> {
    constructor(props: RouteComponentProps) {
        super(props);
        this.state = {
            commands: [],
        };
    }

    async componentDidMount(): Promise<void> {
        const result = await /**@ts-ignore*/
        (await fetch(`/api/commands/${this.props.match.params.module}`)).json();
        this.setState({
            commands: result.commands,
        });
    }

    render(): JSX.Element {
        console.log(this.props);
        return (
            <React.Fragment>
                <div className="command-module-header">
                    <div className="command-module-header-button">
                        <Link to="/commands">ᐸ Back</Link>
                    </div>
                    <div className="command-module-header-text">
                        {/**@ts-ignore*/}
                        <h1>{this.props.match.params.module} Module</h1>
                    </div>
                </div>
                <div
                    className={`command-container ${
                        this.state.commands.length == 0 ? 'loading' : ''
                    }`}
                >
                    {this.state.commands.length == 0 ? (
                        <h1 className="loading">Loading...</h1>
                    ) : (
                        this.state.commands.map(cmd => (
                            <CommandTile key={cmd.name} command={cmd} />
                        ))
                    )}
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(CommandModulePage);

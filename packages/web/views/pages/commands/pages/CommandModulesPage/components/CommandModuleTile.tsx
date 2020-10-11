import React, { Component } from 'react';
import './CommandModuleTile.sass';
import type { RouteComponentProps } from 'react-router-dom';
import { withRouter, Link } from 'react-router-dom';

interface CommandModule {
    name: string;
    description: string;
}

interface CommandModuleTileProps extends RouteComponentProps {
    commandModule: CommandModule;
}

class CommandModuleTile extends Component<CommandModuleTileProps> {
    render(): JSX.Element {
        return (
            <Link
                to={`${this.props.match.url}/${this.props.commandModule.name}`}
            >
                <div className="command-module">
                    <h1>{this.props.commandModule.name}</h1>
                    <p>{this.props.commandModule.description}</p>
                </div>
            </Link>
        );
    }
}

export default withRouter(CommandModuleTile);

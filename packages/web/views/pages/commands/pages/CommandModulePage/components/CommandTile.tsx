import React, { Component } from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import { Link, withRouter } from 'react-router-dom';
import './CommandTile.sass';

interface Command {
    name: string;
    description: string;
}

interface CommandTileProps extends RouteComponentProps {
    command: Command;
}

class CommandTile extends Component<CommandTileProps> {
    render(): JSX.Element {
        return (
            <Link to={`${this.props.match.url}/${this.props.command.name}`}>
                <div className="command">
                    <h1>u!{this.props.command.name}</h1>
                    <p>{this.props.command.description}</p>
                </div>
            </Link>
        );
    }
}

export default withRouter(CommandTile);

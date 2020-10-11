import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import type { RouteComponentProps } from 'react-router-dom';
import CommandCard from './components/CommandCard';
import './CommandPage.sass';

interface Command {
    name: string;
    description: string;
    usage: string;
    aliases: string[];
}

interface CommandModulePageState {
    command?: Command;
}

class CommandPage extends Component<
    RouteComponentProps,
    CommandModulePageState
> {
    constructor(props: RouteComponentProps) {
        super(props);
        this.state = {};
    }

    async componentDidMount(): Promise<void> {
        const result = await (
            await fetch(
                /**@ts-ignore*/
                `/api/commands/${this.props.match.params.module}/${this.props.match.params.command}`
            )
        ).json();

        this.setState({
            command: result.command,
        });
    }

    render(): JSX.Element {
        return (
            <div className="command-header">
                <div className="command-header-button">
                    {/**@ts-ignore*/}
                    <Link to={`/commands/${this.props.match.params.module}`}>
                        ᐸ Back
                    </Link>
                </div>
                <div className="command-header-text">
                    {this.state.command ? (
                        <CommandCard
                            name={this.state.command.name}
                            description={this.state.command.description}
                            usage={this.state.command.usage}
                            aliases={this.state.command.aliases}
                        />
                    ) : (
                        <h1>Loading...</h1>
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(CommandPage);

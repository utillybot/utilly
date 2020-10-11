import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import type { RouteComponentProps } from 'react-router-dom';
import CommandCard from './components/CommandCard';
import './CommandPage.sass';
import type { Command, CommandModule } from '../../Commands';

interface CommandPageProps extends RouteComponentProps {
    commandModules: CommandModule[];
}

class CommandPage extends Component<CommandPageProps> {
    resolveCommand(): [Command, CommandModule] | undefined {
        /** @ts-ignore*/
        const mod = this.props.match.params.module;
        /** @ts-ignore*/
        const cmd = this.props.match.params.command;

        for (const module of this.props.commandModules) {
            if (mod.toLowerCase() == module.name.toLowerCase()) {
                for (const command of module.commands) {
                    if (cmd.toLowerCase() == command.name.toLowerCase()) {
                        return [command, module];
                    }
                }
            }
        }
    }

    render(): JSX.Element {
        const result = this.resolveCommand();

        const command = result ? result[0] : undefined;
        const module = result ? result[1] : undefined;

        return (
            <div className="command-header">
                <div className="command-header-button">
                    <Link to={`/commands${`/${module?.name}` ?? ''}`}>
                        ᐸ Back
                    </Link>
                </div>
                <div className="command-header-text">
                    {command ? (
                        <CommandCard
                            name={command.name}
                            description={command.description}
                            usage={command.usage}
                            aliases={command.aliases}
                        />
                    ) : (
                        <h1>Command not found</h1>
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(CommandPage);

import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import type { RouteComponentProps } from 'react-router-dom';
import CommandTile from './components/CommandTile';
import './CommandModulePage.sass';
import type { CommandModule } from '../../Commands';
import { Command } from '../../Commands';

interface CommandModulesPageProps extends RouteComponentProps {
    commandModules: CommandModule[];
}

class CommandModulePage extends Component<CommandModulesPageProps> {
    resolveModule(): CommandModule | undefined {
        /** @ts-ignore*/
        const mod = this.props.match.params.module;

        for (const module of this.props.commandModules) {
            if (mod.toLowerCase() == module.name.toLowerCase()) {
                return module;
            }
        }
    }

    render(): JSX.Element {
        const module = this.resolveModule();

        return (
            <React.Fragment>
                <div className="command-module-header">
                    <div className="command-module-header-button">
                        <Link to="/commands">ᐸ Back</Link>
                    </div>
                    <div className="command-module-header-text">
                        {module ? <h1>{module.name} Module</h1> : ''}
                    </div>
                </div>
                <div className="command-container">
                    {module ? (
                        module.commands.map(cmd => (
                            <CommandTile key={cmd.name} command={cmd} />
                        ))
                    ) : (
                        <h1>Command Module not found</h1>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(CommandModulePage);

import React, { Component } from 'react';
import CommandModuleTile from './components/CommandModuleTile';
import './CommandModulesPage.sass';
import type { CommandModule } from '../../Commands';

interface CommandModulesPageProps {
    commandModules: CommandModule[];
}

class CommandModulesPage extends Component<CommandModulesPageProps> {
    render(): JSX.Element {
        return (
            <div
                className={`command-module-container ${
                    this.props.commandModules.length == 0 ? 'loading' : ''
                }`}
            >
                {this.props.commandModules.length == 0 ? (
                    <h1 className="loading">Loading...</h1>
                ) : (
                    this.props.commandModules.map(module => (
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

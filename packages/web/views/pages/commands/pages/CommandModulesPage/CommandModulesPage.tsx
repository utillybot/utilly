import React, { Component } from 'react';
import CommandModuleTile from './components/CommandModuleTile';
import './CommandModulesPage.sass';
import type { CommandsResponse, Resource } from '../../../../API';

interface CommandModulesPageProps {
    resource: Resource<CommandsResponse>;
}

class CommandModulesPage extends Component<CommandModulesPageProps> {
    render(): JSX.Element {
        const response = this.props.resource.read();
        return (
            <div
                className={`command-module-container ${
                    response.commandModules.length == 0 ? 'loading' : ''
                }`}
            >
                {response.commandModules.length == 0 ? (
                    <h1 className="loading">Loading...</h1>
                ) : (
                    response.commandModules.map(module => (
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

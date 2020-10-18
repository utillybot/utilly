import React from 'react';
import { Link, useParams } from 'react-router-dom';
import CommandTile from './components/CommandTile';
import './CommandModulePage.sass';
import type {
    CommandModule,
    CommandsResponse,
    Resource,
} from '../../../../API';

interface CommandModulesPageProps {
    resource: Resource<CommandsResponse>;
}

const CommandModulePage = ({
    resource,
}: CommandModulesPageProps): JSX.Element => {
    const params = useParams<{ module: string }>();

    let module: CommandModule | undefined = undefined;
    const moduleParam: string = params.module;
    for (const mod of resource.read().commandModules) {
        if (moduleParam.toLowerCase() == mod.name.toLowerCase()) {
            module = mod;
        }
    }

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
};

export default CommandModulePage;

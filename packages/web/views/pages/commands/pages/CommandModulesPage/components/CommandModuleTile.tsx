import React from 'react';
import './CommandModuleTile.scss';
import { useRouteMatch, Link } from 'react-router-dom';
import type { CommandModule } from '../../../../../API';

interface CommandModuleTileProps {
    commandModule: CommandModule;
}

const CommandModuleTile = ({
    commandModule,
}: CommandModuleTileProps): JSX.Element => {
    const match = useRouteMatch();
    return (
        <Link to={`${match.url}/${commandModule.name.toLowerCase()}`}>
            <div className="command-module">
                <h1>{commandModule.name}</h1>
                <p>{commandModule.description}</p>
            </div>
        </Link>
    );
};

export default CommandModuleTile;

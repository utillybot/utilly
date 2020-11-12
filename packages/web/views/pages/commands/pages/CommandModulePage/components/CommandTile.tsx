import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import './CommandTile.scss';
import type { Command } from '../../../../../API';

interface CommandTileProps {
    command: Command;
}

const CommandTile = ({ command }: CommandTileProps): JSX.Element => {
    const match = useRouteMatch();
    return (
        <Link to={`${match.url}/${command.name}`}>
            <div className="command">
                <h1>u!{command.name}</h1>
                <p>{command.description}</p>
            </div>
        </Link>
    );
};

export default CommandTile;

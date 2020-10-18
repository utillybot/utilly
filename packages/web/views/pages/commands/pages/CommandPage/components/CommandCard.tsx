import React from 'react';
import './CommandCard.sass';
import type { Command } from '../../../../../API';

const CommandCard = ({
    name,
    description,
    aliases,
    usage,
}: Command): JSX.Element => {
    return (
        <div className="command-card">
            <h1>u!{name}</h1>
            <h3 className="command-description">{description}</h3>
            <h3 className="command-usage">
                <b>Usage: </b>
                <code>
                    u!{name} {usage}
                </code>
            </h3>
            {aliases.length > 0 ? (
                <h3>
                    <b>Aliases:</b>{' '}
                    <code>{aliases.map(alias => `u!${alias}`).join(', ')}</code>
                </h3>
            ) : (
                ''
            )}
        </div>
    );
};

export default CommandCard;

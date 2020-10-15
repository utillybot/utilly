import React, { Component } from 'react';
import './CommandCard.sass';
import type { Command } from '../../../../../API';

class CommandCard extends Component<Command> {
    render(): JSX.Element {
        return (
            <div className="command-card">
                <h1>u!{this.props.name}</h1>
                <h3 className="command-description">
                    {this.props.description}
                </h3>
                <h3 className="command-usage">
                    <b>Usage: </b>
                    <code>
                        u!{this.props.name} {this.props.usage}
                    </code>
                </h3>
                {this.props.aliases.length > 0 ? (
                    <h3>
                        <b>Aliases:</b>{' '}
                        <code>
                            {this.props.aliases
                                .map(alias => `u!${alias}`)
                                .join(', ')}
                        </code>
                    </h3>
                ) : (
                    ''
                )}
            </div>
        );
    }
}

export default CommandCard;

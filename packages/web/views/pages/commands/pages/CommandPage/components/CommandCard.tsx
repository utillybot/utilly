import React, { Component } from 'react';
import './CommandCard.sass';

interface CommandCardProps {
    name: string;
    description: string;
    usage: string;
    aliases: string[];
}

class CommandCard extends Component<CommandCardProps> {
    render(): JSX.Element {
        return (
            <div className="command-card">
                <h1>u!{this.props.name}</h1>
                <h3 className="command-description">
                    {this.props.description}
                </h3>
                <h3 className="command-usage">
                    <code>
                        u!{this.props.name} {this.props.usage}
                    </code>
                </h3>
                {this.props.aliases.length > 0 ? (
                    <h3>
                        <b>Aliases:</b> {this.props.aliases.join(', ')}
                    </h3>
                ) : (
                    ''
                )}
            </div>
        );
    }
}

export default CommandCard;

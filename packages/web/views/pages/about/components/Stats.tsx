import React, { Component } from 'react';
import './Stats.sass';

interface StatsProps {
    statName: string;
    statValue: string;
    units: string;
}

class Stats extends Component<StatsProps> {
    render(): JSX.Element {
        return (
            <div className="stat">
                <h1 className="stat-name">{this.props.statName}</h1>
                <h2 className="stat-value">
                    {this.props.statValue} {this.props.units}
                </h2>
            </div>
        );
    }
}

export default Stats;

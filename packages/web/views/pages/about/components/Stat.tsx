import React, { Component } from 'react';
import './Stat.sass';

interface StatsProps {
    statName: string;
    statValue: string;
    units: string;
}

class Stat extends Component<StatsProps> {
    render(): JSX.Element {
        return (
            <div className="stat">
                <h1>{this.props.statName}</h1>
                <h2>
                    {this.props.statValue} {this.props.units}
                </h2>
            </div>
        );
    }
}

export default Stat;

import React, { Component } from 'react';
import Stat from './Stat';
import './StatsContainer.sass';
import { fetchStats } from '../../../API';

interface StatsContainerState {
    guilds?: number;
    users?: number;
}

class StatsContainer extends Component<unknown, StatsContainerState> {
    timerID?: number;

    constructor(props: unknown) {
        super(props);
        this.timerID = undefined;
        this.state = {};
        this.tick();
    }

    componentDidMount(): void {
        this.tick();
        /*@ts-ignore*/
        this.timerID = setInterval(() => this.tick(), 15 * 1000);
    }

    async tick(): Promise<void> {
        const stats = await fetchStats();
        if (stats) this.setState(stats);
    }

    componentWillUnmount(): void {
        clearInterval(this.timerID);
    }

    render(): JSX.Element {
        return (
            <React.Fragment>
                <Stat
                    statName="Guilds"
                    statValue={
                        this.state.guilds
                            ? this.state.guilds.toString()
                            : 'Loading stat'
                    }
                    units="guilds"
                />
                <Stat
                    statName="Users"
                    statValue={
                        this.state.users
                            ? this.state.users.toString()
                            : 'Loading stat'
                    }
                    units="users"
                />
            </React.Fragment>
        );
    }
}

export default StatsContainer;

import React, { Component } from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import 'regenerator-runtime/runtime';
import './About.sass';
import Stats from './components/Stats';

interface AboutState {
    guilds?: number;
    users?: number;
}

class About extends Component<RouteComponentProps, AboutState> {
    timerID?: number;

    constructor(props: RouteComponentProps) {
        super(props);
        this.state = { guilds: undefined, users: undefined };
        this.timerID = undefined;
    }

    componentDidMount() {
        this.tick();
        /*@ts-ignore*/
        this.timerID = setInterval(() => this.tick(), 30 * 1000);
    }

    async tick() {
        const fetchedResult = await fetch('/stats');
        console.log(fetchedResult);
        if (fetchedResult.status == 200) {
            const data = await fetchedResult.json();
            this.setState({
                guilds: data.guilds,
                users: data.users,
            });
        }
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    render(): JSX.Element {
        return (
            <React.Fragment>
                <div className="about">
                    <header className="header">
                        <h1 className="about-description">
                            Utilly is a modular bot that contains many tools for
                            server owners, while also being customizable.
                        </h1>
                    </header>
                    <div className="stats">
                        <div className="stats-header">
                            <h2 className="stats-header-title">Statistics</h2>
                            <h3 className="stats-header-subtitle">
                                These statistics update every 30 seconds
                            </h3>
                        </div>
                        <div className="stats-container">
                            <Stats
                                statName="Guilds"
                                statValue={
                                    this.state.guilds
                                        ? this.state.guilds.toString()
                                        : 'Unavailable'
                                }
                                units="guilds"
                            />
                            <Stats
                                statName="Users"
                                statValue={
                                    this.state.users
                                        ? this.state.users.toString()
                                        : 'Unavailable'
                                }
                                units="users"
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(About);

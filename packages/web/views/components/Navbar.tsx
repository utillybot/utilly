import React, { Component } from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import { Link, withRouter } from 'react-router-dom';
import { ROUTE_CONSTANTS } from '../ROUTE_CONSTANTS';
import './Navbar.sass';

interface NavbarState {
    collapsed: boolean;
}

class Navbar extends Component<RouteComponentProps, NavbarState> {
    constructor(props: RouteComponentProps) {
        super(props);
        this.state = { collapsed: true };
    }

    toggleNavbar() {
        this.setState(prevState => {
            return { collapsed: !prevState.collapsed };
        });
    }

    render(): JSX.Element {
        const navbarElements: JSX.Element[] = [];
        let currentPage;
        const isCollapsed = this.state.collapsed ? 'collapsed' : 'open';

        const generateSVG = (x: number, y: number, l: number): JSX.Element => {
            return (
                <path
                    key={`${x},${y} ${l}`}
                    className={`hamburger-line ${isCollapsed}`}
                    d={`M ${x},${y} h${l}`}
                />
            );
        };
        for (const pageRoute of ROUTE_CONSTANTS) {
            if (this.props.location.pathname == pageRoute.path)
                currentPage = pageRoute;
            navbarElements.push(
                <Link
                    key={pageRoute.name}
                    to={pageRoute.path}
                    className={`nav-item ${
                        this.props.location.pathname === pageRoute.path
                            ? 'selected'
                            : ''
                    }`}
                >
                    {pageRoute.name}
                </Link>
            );
        }
        return (
            <div className="nav">
                <div className="nav-container nav-header">
                    <div className="nav-header-current">
                        <h1>{currentPage?.name}</h1>
                    </div>
                    <div
                        className="nav-header-hamburger"
                        onClick={this.toggleNavbar.bind(this)}
                    >
                        <button className="hamburger">
                            <svg viewBox="0 0 10 10" width="40">
                                {[
                                    [1, 2, 8],
                                    [1, 5, 8],
                                    [1, 8, 8],
                                ].map(i => generateSVG(i[0], i[1], i[2]))}
                            </svg>
                        </button>
                    </div>
                </div>
                <div
                    className={`nav-container nav-links nav-collapsable ${isCollapsed}`}
                >
                    {navbarElements}
                </div>
                <div
                    className={`nav-container nav-signin nav-collapsable ${isCollapsed}`}
                >
                    <Link to="/" className="nav-item">
                        Sign in with Discord
                    </Link>
                </div>
            </div>
        );
    }
}

export default withRouter(Navbar);

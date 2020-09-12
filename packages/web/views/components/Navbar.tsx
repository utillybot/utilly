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
            const elements = document.querySelectorAll(
                '.nav-collapsable'
            ) as NodeListOf<HTMLElement>;
            for (const element of elements) {
                if (prevState.collapsed) {
                    element.classList.remove('collapsed');
                } else {
                    element.classList.add('collapsed');
                }
            }
            return { collapsed: !prevState.collapsed };
        });
    }

    render(): JSX.Element {
        const navbarElements: JSX.Element[] = [];
        let currentPage;
        for (const pageRoute of ROUTE_CONSTANTS) {
            if (this.props.location.pathname == pageRoute.path)
                currentPage = pageRoute;
            navbarElements.push(
                <Link
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
                                <path
                                    className={`hamburger-line ${
                                        this.state.collapsed
                                            ? 'collapsed'
                                            : 'open'
                                    }`}
                                    d="M 1,2 h8"
                                />
                                <path
                                    className={`hamburger-line ${
                                        this.state.collapsed
                                            ? 'collapsed'
                                            : 'open'
                                    }`}
                                    d="M 1,5 h8"
                                />
                                <path
                                    className={`hamburger-line ${
                                        this.state.collapsed
                                            ? 'collapsed'
                                            : 'open'
                                    }`}
                                    d="M 1,8 h8"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div
                    className={`nav-container nav-links nav-collapsable ${
                        this.state.collapsed ? 'collapsed' : ''
                    }`}
                >
                    {navbarElements}
                </div>
                <div
                    className={`nav-container nav-signin nav-collapsable ${
                        this.state.collapsed ? 'collapsed' : ''
                    }`}
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

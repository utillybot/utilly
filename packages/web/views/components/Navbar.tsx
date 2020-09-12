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
                    element.style.transition = 'max-height 1s ease-in';
                } else {
                    element.classList.add('collapsed');
                    element.style.transition = 'max-height 1s ease-out';
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
                            <svg viewBox="0 0 10 8" width="40">
                                <path
                                    d="M1 1h8M1 4h 8M1 7h8"
                                    stroke="#fff"
                                    strokeWidth="2"
                                    strokeLinecap="round"
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

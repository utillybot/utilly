import React, { Component } from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import { Link, withRouter } from 'react-router-dom';
import { ROUTE_CONSTANTS } from '../ROUTE_CONSTANTS';
import './Navbar.sass';

class Navbar extends Component<RouteComponentProps> {
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
                <div className="nav-links">{navbarElements}</div>
                <div className="nav-header">
                    <h1>{currentPage?.name}</h1>
                </div>
                <div className="nav-signin">
                    <Link to="/" className="nav-item">
                        Sign in with Discord
                    </Link>
                </div>
            </div>
        );
    }
}

export default withRouter(Navbar);

import React, { Component } from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import { Link, withRouter } from 'react-router-dom';
import { ROUTE_CONSTANTS } from '../ROUTE_CONSTANTS';
import './Navbar.css';

class Navbar extends Component<RouteComponentProps> {
    render(): JSX.Element {
        const navbarElements: JSX.Element[] = [];
        for (const pageRoute of ROUTE_CONSTANTS) {
            navbarElements.push(
                <li>
                    <Link
                        to={pageRoute.path}
                        className={`navitem ${
                            this.props.location.pathname === pageRoute.path
                                ? 'selected'
                                : ''
                        }`}
                    >
                        {pageRoute.name}
                    </Link>
                </li>
            );
        }
        return (
            <div className="nav">
                <ul className="navbar">{navbarElements}</ul>
            </div>
        );
    }
}

export default withRouter(Navbar);

import React, { Component } from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import { Link, withRouter } from 'react-router-dom';
import './Navbar.css';

class Navbar extends Component<RouteComponentProps> {
    render(): JSX.Element {
        const pages = new Map();
        pages.set('Home', '/');
        pages.set('Commands', '/commands');
        pages.set('About', '/about');

        const navbarElements: JSX.Element[] = [];
        for (const [page, pageRoute] of pages) {
            navbarElements.push(
                <li>
                    <Link
                        to={pageRoute}
                        className={`navitem ${
                            this.props.location.pathname === pageRoute
                                ? 'selected'
                                : ''
                        }`}
                    >
                        {page}
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

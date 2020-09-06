import React, { Component } from 'react';
import './Navbar.css';

interface NavbarProps {
    selected: string;
}

class Navbar extends Component<NavbarProps> {
    render(): JSX.Element {
        const pages = new Map();
        pages.set('Home', '/');
        pages.set('Commands', '/commands');
        pages.set('About', '/about');

        const navbarElements: JSX.Element[] = [];
        for (const [page, pageRoute] of pages) {
            if (this.props.selected == page) {
                navbarElements.push(
                    <li>
                        <a href={pageRoute} className="navitem selected">
                            {page}
                        </a>
                    </li>
                );
            } else {
                navbarElements.push(
                    <li>
                        <a href={pageRoute} className="navitem">
                            {page}
                        </a>
                    </li>
                );
            }
        }
        return (
            <div className="nav">
                <ul className="navbar">{navbarElements}</ul>
            </div>
        );
    }
}

export default Navbar;

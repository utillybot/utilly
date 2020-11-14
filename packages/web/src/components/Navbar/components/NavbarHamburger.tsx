import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import styles from './NavbarHamburger.module.scss';
import { cn } from '../../../helpers';

const generateSVG = (
	x: number,
	y: number,
	l: number,
	collapsed: boolean
): JSX.Element => {
	return (
		<path
			key={`${x},${y} ${l}`}
			className={cn(styles.line, collapsed ? styles.collapsed : styles.open)}
			d={`M ${x},${y} h${l}`}
		/>
	);
};

interface NavbarHamburgerProps {
	collapsedState: [boolean, Dispatch<SetStateAction<boolean>>];
}

const NavbarHamburger = ({
	collapsedState,
}: NavbarHamburgerProps): JSX.Element => {
	const [collapsed, setCollapsed] = collapsedState;
	return (
		<div
			className={styles.container}
			onClick={() => setCollapsed(prev => !prev)}
		>
			<button className={styles.hamburger} aria-label="Toggle Navigation">
				<svg viewBox="0 0 10 10" width="30">
					{[
						[1, 2, 8],
						[1, 5, 8],
						[1, 8, 8],
					].map(i => generateSVG(i[0], i[1], i[2], collapsed))}
				</svg>
			</button>
		</div>
	);
};

export default NavbarHamburger;

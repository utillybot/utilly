import { cn } from '../../../helpers';
import styles from './NavbarContainer.module.scss';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import React from 'react';

const NavbarContainer = (
	props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
): JSX.Element => {
	return (
		<div
			{...props}
			className={
				props.className
					? cn(props.className, styles.container)
					: styles.container
			}
		/>
	);
};

export default NavbarContainer;

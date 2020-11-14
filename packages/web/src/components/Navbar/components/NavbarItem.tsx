import type { LinkProps } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './NavbarItem.module.scss';
import React from 'react';
import { cn } from '../../../helpers';

const NavbarItem = (props: LinkProps): JSX.Element => {
	return (
		<Link
			{...props}
			className={
				props.className ? cn(props.className, styles.item) : styles.item
			}
		/>
	);
};

export default NavbarItem;

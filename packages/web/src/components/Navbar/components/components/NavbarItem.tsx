import type { LinkProps } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './NavbarItem.module.scss';
import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import { mc } from '../../../../helpers';

const NavbarItem = (
	props: LinkProps & { setCollapsed: Dispatch<SetStateAction<boolean>> }
): JSX.Element => {
	return (
		<Link
			{...props}
			onClick={() => props.setCollapsed(true)}
			className={mc(props.className, styles.item)}
		/>
	);
};

export default NavbarItem;

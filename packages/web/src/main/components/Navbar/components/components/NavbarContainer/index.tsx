import { mc } from '../../../../../../helpers';
import styles from './index.module.scss';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

const NavbarContainer = (
	props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
): JSX.Element => {
	return <div {...props} className={mc(props.className, styles.container)} />;
};

export default NavbarContainer;

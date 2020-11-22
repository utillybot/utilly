import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import { mc } from '../../../../../../helpers';
import styles from './index.module.scss';

const NavbarSection = (
	props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
): JSX.Element => {
	return <div {...props} className={mc(props.className, styles.section)} />;
};

export default NavbarSection;

import type { LinkProps } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './NavbarItem.module.scss';
import { mc } from '../../../../helpers';
import useCollapsed from '../../../../hooks/useCollapsed';

const NavbarItem = (props: LinkProps): JSX.Element => {
	const { setCollapsed } = useCollapsed();
	return (
		<Link
			{...props}
			onClick={() => setCollapsed(true)}
			className={mc(props.className, styles.item)}
		/>
	);
};

export default NavbarItem;

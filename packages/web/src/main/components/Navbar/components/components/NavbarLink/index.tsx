import type { LinkProps } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './index.module.scss';
import { mc } from '../../../../../../helpers';
import useCollapsed from '../../../../../../components/Collapsable/CollapsableContext/useCollapsed';

const NavbarLink = (props: LinkProps): JSX.Element => {
	const { setCollapsed } = useCollapsed();
	return (
		<Link
			{...props}
			onClick={() => setCollapsed(true)}
			className={mc(props.className, styles.item)}
		/>
	);
};

export default NavbarLink;

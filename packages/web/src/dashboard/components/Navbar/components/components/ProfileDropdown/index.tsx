import Collapsable from '../../../../../../components/Collapsable/Collapsable';
import Button from '../../../../../../components/Button';
import styles from './index.module.scss';
import useCollapsed from '../../../../../../components/Collapsable/CollapsableContext/useCollapsed';
import type { RefObject } from 'react';

interface ProfileDropdownProps {
	profileRef: RefObject<HTMLDivElement>;
}

const ProfileDropdown = ({ profileRef }: ProfileDropdownProps): JSX.Element => {
	const { setCollapsed } = useCollapsed();

	return (
		<>
			<Collapsable
				className={styles.dropdown}
				style={{ width: profileRef.current?.scrollWidth + 'px' }}
			>
				<Button to="/dashboard/servers" onClick={() => setCollapsed(true)}>
					My Servers
				</Button>
				<Button
					to="/dashboard/logout"
					onClick={() => document.location.assign('/dashboard/logout')}
				>
					Logout
				</Button>
			</Collapsable>
		</>
	);
};

export default ProfileDropdown;

import styles from '../../NavbarProfile/index.module.scss';
import { getUserAvatar } from '../../../../../helpers';
import useCollapsed from '../../../../../../components/Collapsable/CollapsableContext/useCollapsed';
import useMatchMedia from '../../../../../../hooks/useMatchMedia';
import { cmq } from '../../../../../../helpers';
import useUserContext from '../../../../UserContext/useUserContext';
import { forwardRef } from 'react';

// eslint-disable-next-line react/display-name
const NavbarProfileButton = forwardRef<HTMLDivElement>((props, profileRef) => {
	const { setCollapsed } = useCollapsed();
	const isDesktop = useMatchMedia(cmq(['min-width', [768, 'px']]));
	const user = useUserContext();

	if (!user) return <></>;

	return (
		<div
			ref={profileRef}
			className={styles.button}
			onClick={() => setCollapsed(prevState => !prevState)}
		>
			{isDesktop && (
				<p>
					{user.username}#{user.discriminator}
				</p>
			)}
			<img
				src={getUserAvatar(user.id, user.avatar, user.discriminator, 64)}
				alt="User Avatar"
			/>
		</div>
	);
});

export default NavbarProfileButton;

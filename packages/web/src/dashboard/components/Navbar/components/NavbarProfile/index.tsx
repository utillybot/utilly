import CollapsableContent from '../../../../../components/Collapsable/CollapsableContent';
import NavbarSection from '../components/NavbarSection';
import styles from './index.module.scss';
import ProfileDropdown from '../components/ProfileDropdown';
import useUserContext from '../../../UserContext/useUserContext';
import { useRef } from 'react';
import useMatchMedia from '../../../../../hooks/useMatchMedia';
import { cmq } from '../../../../../helpers';
import Hamburger from '../../../../../components/Collapsable/Hamburger';
import NavbarProfileButton from '../components/NavbarProfileButton';

const NavbarProfile = (): JSX.Element => {
	const user = useUserContext();
	const profileRef = useRef<HTMLDivElement>(null);
	const isDesktop = useMatchMedia(cmq(['min-width', [768, 'px']]));
	if (!user) return <></>;

	return (
		<NavbarSection className={styles.profile}>
			{!isDesktop && (
				<div className={styles.hamburger}>
					<Hamburger />
				</div>
			)}
			<CollapsableContent>
				<NavbarProfileButton ref={profileRef} />
				<ProfileDropdown profileRef={profileRef} />
			</CollapsableContent>
		</NavbarSection>
	);
};

export default NavbarProfile;

import styles from './index.module.scss';
import { NavLink } from 'react-router-dom';
import { routes } from '../../routes';
import Button from '../../../components/Button';
import useUserContext from '../UserContext/useUserContext';
import { getUserAvatar } from '../../helpers';
import { mc } from '../../../helpers';

const Navbar = (): JSX.Element => {
	const user = useUserContext();
	if (!user) return <></>;
	return (
		<div className={styles.navbar}>
			<div className={mc(styles.back, styles.navbarSection)}>
				<Button to="/" className={styles.button}>
					ᐸ Back to main site
				</Button>
			</div>
			<div className={mc(styles.links, styles.navbarSection)}>
				{routes.map(
					({ path, name, exact, displayInNavbar }) =>
						(displayInNavbar ?? true) && (
							<NavLink
								exact={exact ?? true}
								className={styles.navbarItem}
								activeClassName={styles.active}
								key={name}
								to={path}
							>
								{name}
							</NavLink>
						)
				)}
			</div>
			<div className={mc(styles.profile, styles.navbarSection)}>
				<p>
					{user.username}#{user.discriminator}
				</p>
				<img
					height="55px"
					width="55px"
					src={getUserAvatar(user.id, user.avatar, user.discriminator, 64)}
					alt="User Avatar"
				/>
			</div>
		</div>
	);
};

export default Navbar;

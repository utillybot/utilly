import { routes } from '../../routes';
import { NavLink } from 'react-router-dom';
import useGuildContext from '../GuildContext/useGuildContext';
import styles from './index.module.scss';

const Navbar = (): JSX.Element => {
	const guild = useGuildContext().guild;
	return (
		<nav className={styles.navbar}>
			{routes.map(({ path, name, exact }) => (
				<NavLink
					exact={exact ?? true}
					className={styles.navbarItem}
					activeClassName={styles.active}
					key={name}
					to={path.replace(':id', guild.id)}
				>
					{name}
				</NavLink>
			))}
		</nav>
	);
};

export default Navbar;

import { routes } from '../routes';
import { Link } from 'react-router-dom';
import useGuildContext from '../hooks/useGuildContext';

export const GuildManagementNavbar = (): JSX.Element => {
	const guild = useGuildContext().guild;
	return (
		<div>
			{routes.map(({ path, name }) => (
				<Link key={name} to={path.replace(':id', guild.id)} />
			))}
		</div>
	);
};

export default GuildManagementNavbar;

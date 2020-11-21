import { getGuildIcon } from '../../../../../../helpers';
import useGuildContext from '../../hooks/useGuildContext';

const Overview = (): JSX.Element => {
	const guild = useGuildContext().guild;
	return (
		<header>
			<img src={getGuildIcon(guild.id, guild.icon)} alt="Guild Icon" />
			<h1>{guild.name}</h1>
		</header>
	);
};

export default Overview;

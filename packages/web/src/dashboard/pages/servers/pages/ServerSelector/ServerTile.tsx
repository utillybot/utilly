import styles from './ServerTile.module.scss';
import { mc } from '../../../../../helpers';
import Button from '../../../../../components/Button';
import { getGuildIcon } from '../../../../helpers';
import type { PartialGuild } from '../../../../types';

interface ServerTileProps {
	guild: PartialGuild;
	inactive?: boolean;
}

const ServerTile = ({ guild, inactive }: ServerTileProps): JSX.Element => {
	return (
		<Button
			className={mc(styles.tile, { [styles.inactive]: inactive })}
			to={`/dashboard/servers/${guild.id}`}
		>
			<img src={getGuildIcon(guild.id, guild.icon)} alt="Guild Icon" />
			<p>{guild.name}</p>
		</Button>
	);
};

export default ServerTile;

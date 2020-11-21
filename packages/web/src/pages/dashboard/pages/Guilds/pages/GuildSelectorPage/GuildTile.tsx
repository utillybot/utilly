import styles from './GuildTile.module.scss';
import { mc } from '../../../../../../helpers';
import Button from '../../../../../../components/Button/Button';
import { getGuildIcon } from '../../../../helpers';

interface PartialGuild {
	id: string;
	name: string;
	icon: string | null | undefined;
	owner?: boolean;
	permissions?: number;
	features: string[];
	permissions_new?: string;
}

interface GuildTileProps {
	guild: PartialGuild;
	inactive?: boolean;
}

const GuildTile = ({ guild, inactive }: GuildTileProps): JSX.Element => {
	return (
		<Button
			className={mc(styles.tile, { [styles.inactive]: inactive })}
			to={`/dashboard/guilds/${guild.id}`}
		>
			<img src={getGuildIcon(guild.id, guild.icon)} alt="Guild Icon" />
			<p>{guild.name}</p>
		</Button>
	);
};

export default GuildTile;

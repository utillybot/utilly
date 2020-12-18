import styles from './index.module.scss';
import ServerTile from './ServerTile';
import Page from '../../../../components/Page';
import Spinner from '../../../../../components/Spinner';
import useGuildsContext from '../../components/GuildsContext/useUserContext';

const ServerSelector = (): JSX.Element => {
	const result = useGuildsContext();

	if (!result) return <Spinner />;

	return (
		<Page className={styles.page}>
			<h1>Click on a server to manage it</h1>
			<h3>
				Note: The servers shown are the ones that you are the owner of or have
				administrator privileges in.
			</h3>
			<div className={styles.servers}>
				{result.present.map(guild => (
					<ServerTile key={guild.id} guild={guild} />
				))}
				{result.notPresent.map(guild => (
					<ServerTile key={guild.id} guild={guild} inactive />
				))}
			</div>
		</Page>
	);
};

export default ServerSelector;

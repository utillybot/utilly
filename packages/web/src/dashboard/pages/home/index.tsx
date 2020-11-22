import Button from '../../../components/Button';
import styles from './index.module.scss';
import Spinner from '../../../components/Spinner';
import { getUserAvatar } from '../../helpers';
import Page from '../../components/Page';
import useUserContext from '../../components/UserContext/useUserContext';

const Home = (): JSX.Element => {
	const user = useUserContext();
	if (!user) return <Spinner />;

	return (
		<Page>
			<img
				alt="Avatar"
				src={getUserAvatar(user.id, user.avatar, user.discriminator)}
				className={styles.avatar}
			/>
			<h1>
				Welcome to your dashboard {user.username}#{user.discriminator}
			</h1>
			<Button className={styles.button} to="/dashboard/servers">
				Go to Servers
			</Button>
		</Page>
	);
};

export default Home;

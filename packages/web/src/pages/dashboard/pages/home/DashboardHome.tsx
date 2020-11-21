import Page from '../../../../components/Page/Page';
import Button from '../../../../components/Button/Button';
import styles from './DashboardHome.module.scss';
import { useEffect, useState } from 'react';
import Spinner from '../../../../components/Spinner/Spinner';
import { getUserAvatar } from '../../helpers';

interface User {
	id: string;
	username: string;
	discriminator: string;
	avatar: string | null | undefined;
	mfa_enabled?: true;
	locale?: string;
	flags?: number;
	premium_type?: number;
	public_flags?: number;
}

const DashboardHome = (): JSX.Element => {
	const [user, setUser] = useState<User | undefined>(undefined);
	useEffect(() => {
		fetch('/dashboard/api/users')
			.then(res => {
				if (res.status == 401) {
					document.cookie = `prev=${location.pathname}; path=/;`;
					window.location.href = '/dashboard/login';
				}
				return res.json();
			})
			.then(setUser);
	}, []);

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
			<Button className={styles.button} to="/dashboard/guilds">
				Go to Servers
			</Button>
		</Page>
	);
};

export default DashboardHome;

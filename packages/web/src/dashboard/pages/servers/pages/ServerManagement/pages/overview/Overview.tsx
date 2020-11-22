import useGuildContext from '../../components/GuildContext/useGuildContext';
import { useEffect, useState } from 'react';
import Spinner from '../../../../../../../components/Spinner';

export interface GuildOverview {
	prefix: string[];
}

const Overview = (): JSX.Element => {
	const [overview, setOverview] = useState<GuildOverview | undefined>(
		undefined
	);
	const guild = useGuildContext().guild;
	useEffect(() => {
		fetch(`/dashboard/api/guilds/${guild.id}/overview`)
			.then(res => {
				if (res.status == 401) {
					document.cookie = `prev=${location.pathname}; path=/;`;
					window.location.assign('/dashboard/login');
				}
				return res.json();
			})
			.then(setOverview);
	}, [guild.id]);

	if (overview == undefined) return <Spinner />;
	return (
		<>
			<h2>Prefixes:</h2>
			<ul>
				{overview.prefix.map(prefix => {
					return <li key={prefix}>{prefix}</li>;
				})}
			</ul>
		</>
	);
};

export default Overview;

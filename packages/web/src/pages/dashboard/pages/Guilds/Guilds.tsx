import { Route } from 'react-router-dom';
import { GuildSelectorPage } from './pages/GuildSelectorPage/GuildSelectorPage';
import GuildManagementPage from './pages/GuildManagementPage/GuildManagementPage';

const GuildRouter = (): JSX.Element => {
	return (
		<>
			<Route exact path="/dashboard/guilds" component={GuildSelectorPage} />
			<Route
				exact
				path="/dashboard/guilds/:id"
				component={GuildManagementPage}
			/>
		</>
	);
};

export default GuildRouter;

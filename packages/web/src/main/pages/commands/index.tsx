import styles from './index.module.scss';
import { get } from '../../API';
import Page from '../../components/Page';
import ErrorBoundary from './components/ErrorBoundary';
import CommandResourceContext from './components/CommandResourceContext';
import type { RouteData } from '../../../components/Routes/types';
import CommandModules from './pages/CommandModules';
import CommandModule from './pages/CommandModule';
import CommandPage from './pages/CommandPage';
import parseRoutes from '../../../components/Routes';

const routes: RouteData[] = [
	{
		path: '/commands',
		page: CommandModules,
		exact: true,
	},
	{
		path: '/commands/:module',
		page: CommandModule,
		exact: true,
	},
	{
		path: '/commands/:module/:command',
		page: CommandPage,
		exact: true,
	},
];

const commandResource = get().commands;

const Commands = (): JSX.Element => {
	return (
		<Page className={styles.page}>
			<ErrorBoundary>
				<CommandResourceContext.Provider value={commandResource}>
					<header>
						<h2>View all the commands for Utilly!</h2>
					</header>
					{parseRoutes(routes)}
				</CommandResourceContext.Provider>
			</ErrorBoundary>
		</Page>
	);
};

export default Commands;

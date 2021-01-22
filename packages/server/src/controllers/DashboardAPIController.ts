import { Router } from 'express';
import { UtillyClient } from '@utilly/framework';
import OAuth from 'discord-oauth2';
import { dashboardGuildsController } from './DashboardGuildsController';
import { dashboardUsersController } from './DashboardUsersController';

export const dashboardAPIController = (
	bot: UtillyClient,
	oAuth: OAuth
): Router => {
	return Router()
		.use('/guilds', dashboardGuildsController(bot, oAuth))
		.use('/users', dashboardUsersController(oAuth));
};

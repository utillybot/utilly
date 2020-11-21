import { Router } from 'express';
import type OAuth from 'discord-oauth2';

export const dashboardUsersController = (oAuth: OAuth): Router => {
	return Router().get('', async (req, res, next) => {
		try {
			const user = await oAuth.getUser(req.user.access_token);
			res.json(user);
		} catch (err) {
			next(err);
		}
	});
};

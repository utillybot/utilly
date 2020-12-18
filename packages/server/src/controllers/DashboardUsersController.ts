import { Router } from 'express';
import type OAuth from 'discord-oauth2';

export const dashboardUsersController = (oAuth: OAuth): Router => {
	return Router().get('', async (req, res, next) => {
		const token = req.session.user?.accessToken;
		if (!token) return res.sendStatus(500);

		try {
			const user = await oAuth.getUser(token);
			res.json(user);
		} catch (err) {
			next(err);
		}
	});
};

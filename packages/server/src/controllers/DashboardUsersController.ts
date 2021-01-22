import { Router } from 'express';
import OAuth from 'discord-oauth2';

export const dashboardUsersController = (oAuth: OAuth): Router => {
	return Router().get('', async (req, res, next) => {
		const token = req.session.user?.accessToken;
		if (!token) return res.sendStatus(500);

		if (req.session.extendedUser != undefined)
			return res.json(req.session.extendedUser);
		try {
			const user = await oAuth.getUser(token);
			req.session.extendedUser = user;
			res.json(user);
		} catch (err) {
			next(err);
		}
	});
};

import { RequestHandler } from 'express';

export const excludeSourceMaps: RequestHandler = (req, res, next) => {
	if (
		!req.url.endsWith('.map') ||
		(req.session.extendedUser &&
			req.session.extendedUser.id == '236279900728721409')
	) {
		next();
	} else {
		res.sendStatus(404);
	}
};

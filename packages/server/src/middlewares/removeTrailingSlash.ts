import { RequestHandler } from 'express';

export const removeTrailingSlash: RequestHandler = (req, res, next) => {
	const test = /\?[^]*\//.test(req.url);
	if (req.url.substr(-1) === '/' && req.url.length > 1 && !test)
		return res.redirect(req.url.slice(0, -1));
	next();
};

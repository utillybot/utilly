import type { RequestHandler } from 'express';

export const excludeSourceMaps: RequestHandler = (req, res, next) => {
	//if (!req.url.endsWith('.map')) next();
	next();
};

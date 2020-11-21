import type { ErrorRequestHandler } from 'express';
import type { Logger } from '@utilly/utils';

export const errorHandler = (logger: Logger): ErrorRequestHandler => {
	return (err, req, res, next) => {
		logger.error(err.stack);
		res.sendStatus(500);
	};
};

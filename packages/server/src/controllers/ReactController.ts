import express, { Router } from 'express';
import path from 'path';

export const reactController = (): Router => {
	if (process.env.BASE_WEB_URL == undefined)
		throw new Error('BASE_WEB_URL not provided');

	const base = process.env.BASE_WEB_URL;

	return Router()
		.use(
			express.static(path.join(base, 'dist'), {
				redirect: false,
				index: false,
			})
		)
		.get('*', (req, res) => {
			res.sendFile(path.join(base, 'dist', 'index.html'));
		});
};

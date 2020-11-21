import express, { Router } from 'express';
import path from 'path';

export const reactController = (): Router => {
	return Router()
		.use(
			express.static(path.join(process.cwd(), 'packages', 'web', 'dist'), {
				redirect: false,
				index: false,
			})
		)
		.get('*', (req, res) => {
			res.sendFile(
				path.join(process.cwd(), 'packages', 'web', 'dist', 'index.html')
			);
		});
};

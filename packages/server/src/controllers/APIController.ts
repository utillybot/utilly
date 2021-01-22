import { Request, Response, Router } from 'express';
import { UtillyClient } from '@utilly/framework';

export const apiController = (bot: UtillyClient): Router => {
	return Router()
		.get('/stats', (req: Request, res: Response): void => {
			res.json({
				guilds: bot.bot.guilds.size,
				users: bot.bot.users.size,
			});
		})
		.get('/commands', (req: Request, res: Response): void => {
			res.json({
				commandModules: Array.from(
					bot.commandHandler.commandModules.values()
				).map(mod => {
					return {
						name: mod.info.name,
						description: mod.info.description,
						commands: Array.from(mod.commands.values()).map(cmd => cmd.info),
					};
				}),
			});
		});
};

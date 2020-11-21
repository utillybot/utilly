import { Router } from 'express';
import type { UtillyClient } from '@utilly/framework';
import type OAuth from 'discord-oauth2';

interface PartialGuild {
	id: string;
	name: string;
	icon: string | null | undefined;
	owner?: boolean;
	permissions?: number;
	features: string[];
	permissions_new?: string;
}

export const dashboardAPIController = (
	bot: UtillyClient,
	oAuth: OAuth
): Router => {
	const isManageable = (guild: PartialGuild) =>
		guild.owner || (guild.permissions ?? 0) & 0x00000008;

	return Router()
		.get('/guilds', async (req, res, next) => {
			try {
				const guilds = await oAuth.getUserGuilds(req.user?.access_token);
				const mappedGuilds = guilds.filter(isManageable).map(guild => {
					return { name: guild.name, icon: guild.icon, id: guild.id };
				});

				res.json({
					present: mappedGuilds.filter(guild => bot.guilds.has(guild.id)),
					notPresent: mappedGuilds.filter(guild => !bot.guilds.has(guild.id)),
				});
			} catch (error) {
				next(error);
			}
		})
		.get('/guilds/:id', async (req, res, next) => {
			try {
				const guilds = await oAuth.getUserGuilds(req.user?.access_token);
				const guild = guilds.find(guild => guild.id == req.params.id);
				if (!guild)
					return res
						.status(404)
						.send("The provided guild id was not one of the user's guilds,");
				if (!isManageable(guild))
					return res
						.status(403)
						.send('You do not have the permission to get this guild,');

				res.json(guild);
			} catch (error) {
				next(error);
			}
		});
};

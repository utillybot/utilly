import type { UtillyClient } from '@utilly/framework';
import type { RequestHandler } from 'express';
import { Router } from 'express';
import { GuildRepository } from '@utilly/database';
import type OAuth from 'discord-oauth2';
import type { PartialGuild } from '../types';

export const dashboardGuildsController = (
	bot: UtillyClient,
	oAuth: OAuth
): Router => {
	const isManageable = (guild: PartialGuild) =>
		guild.owner || (guild.permissions ?? 0) & 0x00000008;
	const validateGuild: RequestHandler = async (req, res, next) => {
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
			if (!bot.guilds.has(guild.id))
				return res.status(404).send('The bot is not in this guild');

			req.guild = guild;
			next();
		} catch (error) {
			next(error);
		}
	};
	return Router()
		.get('', async (req, res, next) => {
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
		.get('/:id', validateGuild, (req, res) => {
			res.json(req.guild);
		})
		.get('/:id/overview', validateGuild, async (req, res, next) => {
			try {
				const guildRow = await bot.database.connection
					.getCustomRepository(GuildRepository)
					.selectOrCreate(req.guild.id, ['prefix']);
				return res.json({ prefix: guildRow.prefix });
			} catch (err) {
				next(err);
			}
		});
};

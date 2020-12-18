import type { UtillyClient } from '@utilly/framework';
import type { RequestHandler } from 'express';
import { Router } from 'express';
import { GuildRepository } from '@utilly/database';
import type OAuth from 'discord-oauth2';
import type { PartialGuild } from '../types';

const guildsCache = new Map();

export const dashboardGuildsController = (
	bot: UtillyClient,
	oAuth: OAuth
): Router => {
	const isManageable = (guild: PartialGuild) =>
		guild.owner || (guild.permissions ?? 0) & 0x00000008;
	const validateGuild: RequestHandler = async (req, res, next) => {
		try {
			const token = req.session.user?.accessToken;
			if (!token) return res.sendStatus(500);
			const guilds = await oAuth.getUserGuilds(token);
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
			res.locals.guild = guild;
			next();
		} catch (error) {
			next(error);
		}
	};
	return Router()
		.get('', async (req, res, next) => {
			try {
				const token = req.session.user?.accessToken;
				if (!token) return res.sendStatus(500);

				const guilds = await oAuth.getUserGuilds(token);
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
			res.json(res.locals.guild);
		})
		.get('/:id/settings', validateGuild, async (req, res, next) => {
			try {
				const guildRow = await bot.database.connection
					.getCustomRepository(GuildRepository)
					.selectOrCreate(res.locals.guild.id, ['prefix']);
				return res.json({ prefix: guildRow.prefix });
			} catch (err) {
				next(err);
			}
		});
};

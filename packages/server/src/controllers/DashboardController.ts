import type { RequestHandler } from 'express';
import { Router } from 'express';
import type { UtillyClient } from '@utilly/framework';
import { dashboardAPIController } from './DashboardAPIController';
import OAuthClient from 'discord-oauth2';

export const dashboardController = (bot: UtillyClient): Router => {
	if (!process.env.TOKEN_SECRET)
		throw new Error('JWT Token Secret not provided');

	const scope = ['identify', 'guilds'];

	const oAuth = new OAuthClient({
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
	});

	const checkToken: RequestHandler = async (req, res, next) => {
		if (!req.session.user) {
			res.sendStatus(401);
		} else {
			next();
		}
	};
	return Router()
		.get('/authorize', (req, res) => {
			res.redirect(
				oAuth.generateAuthUrl({
					scope,
					responseType: 'code',
					redirectUri:
						req.protocol + '://' + req.get('host') + '/dashboard/callback',
				})
			);
		})
		.get('/oldLogin', (req, res) => {
			res.redirect(
				oAuth.generateAuthUrl({
					scope,
					responseType: 'code',
					redirectUri:
						req.protocol +
						'://' +
						req.get('host') +
						'/dashboard/callback?type=old',
				})
			);
		})

		.get('/logout', (req, res) => {
			req.session.destroy(err => {
				if (err) {
					res.sendStatus(500);
				} else {
					res.status(200).redirect('/');
				}
			});
		})

		.get('/invite', (req, res) => {
			if (req.query.id && typeof req.query.id == 'string') {
				return res.redirect(
					oAuth.generateAuthUrl({
						guildId: req.query.id,
						disableGuildSelect: true,
						permissions: 573926593,
						scope: 'bot',
						redirectUri:
							req.protocol +
							'://' +
							req.get('host') +
							'/dashboard/guild-callback',
					})
				);
			} else {
				return res.redirect(
					oAuth.generateAuthUrl({
						permissions: 573926593,
						scope: 'bot',
						redirectUri:
							req.protocol +
							'://' +
							req.get('host') +
							'/dashboard/guild-callback',
					})
				);
			}
		})

		.get('/guild-callback', (req, res) => {
			const old = req.query.type == 'old';
			if (req.query.error as string) return res.redirect('/dashboard/done');

			const url = old ? req.cookies.prev ?? '/dashboard' : '/dashboard/done';
			if (old && req.cookies.prev) res.clearCookie('prev');
			res.redirect(url);
		})

		.get('/callback', async (req, res, next) => {
			if (req.query.error) {
				return res.redirect('/dashboard/done');
			}
			const code: string | undefined = req.query.code as string;
			if (!code) return res.status(400).send('No access code provided.');

			let response;
			try {
				response = await oAuth.tokenRequest({
					code,
					scope,
					grantType: 'authorization_code',
					redirectUri:
						req.protocol + '://' + req.get('host') + `/dashboard/callback`,
				});
			} catch (error) {
				if ('code' in error && error.code == 400)
					return res.status(400).send('Invalid access code.');
				return next(error);
			}

			if (response.scope != scope.join(' ')) {
				res.redirect('/dashboard/authorize');
			} else {
				req.session.cookie.expires = new Date(
					Date.now() + response.expires_in * 1000
				);
				req.session.user = {
					accessToken: response.access_token,
					expiresIn: response.expires_in,
					refreshToken: response.refresh_token,
					scope: response.scope,
					tokenType: response.token_type,
				};
				res.redirect('/dashboard/done');
			}
		})

		.use('/api', checkToken, dashboardAPIController(bot, oAuth));
};

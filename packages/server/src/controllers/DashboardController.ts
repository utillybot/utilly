import type { RequestHandler } from 'express';
import { Router } from 'express';
import type { GetPublicKeyOrSecret, Secret, SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import type { UtillyClient } from '@utilly/framework';
import { dashboardAPIController } from './DashboardAPIController';
import OAuthClient from 'discord-oauth2';
import type { User } from '../types';

const verifyToken = (
	token: string,
	secretOrPublicKey: Secret | GetPublicKeyOrSecret
): Promise<Record<string, unknown> | undefined> => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secretOrPublicKey, (err, user) => {
			if (err) reject(err);
			resolve(user as Record<string, unknown>);
		});
	});
};

const sign = (
	// eslint-disable-next-line @typescript-eslint/ban-types
	token: string | object,
	secretOrPublicKey: Secret,
	options: SignOptions
): Promise<string | undefined> => {
	return new Promise((resolve, reject) => {
		jwt.sign(token, secretOrPublicKey, options, (err, encoded) => {
			if (err) reject(err);
			resolve(encoded);
		});
	});
};

export const dashboardController = (bot: UtillyClient): Router => {
	if (!process.env.TOKEN_SECRET)
		throw new Error('JWT Token Secret not provided');

	const scope = ['identify', 'guilds'];
	const tokenSecret = process.env.TOKEN_SECRET;

	const oAuth = new OAuthClient({
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
	});

	const checkToken: RequestHandler = async (req, res, next) => {
		const token = req.cookies.token;
		if (!token)
			return res.status(401).send('An authorization token was not provided.');

		let user;
		try {
			user = await verifyToken(token, tokenSecret);
		} catch (err) {
			if (err.name == 'TokenExpiredError') {
				let refreshed;
				try {
					const decoded = jwt.decode(token, { json: true });
					if (decoded && 'refresh_token' in decoded) {
						const refreshToken = decoded?.refresh_token;
						refreshed = await oAuth.tokenRequest({
							refreshToken,
							scope,
							grantType: 'refresh_token',
						});
					} else {
						return res.status(401).send('Invalid refresh token.');
					}
				} catch (error) {
					if ('code' in error && error.code == 400)
						return res.status(401).send('Invalid refresh token.');
					return next(error);
				}

				if (refreshed.scope != scope.join(' ')) {
					return res.status(401).send('Invalid scopes.');
				}
				res.cookie(
					'token',
					await sign(refreshed, tokenSecret, {
						expiresIn: refreshed.expires_in,
					}),
					{
						httpOnly: true,
						maxAge: refreshed.expires_in * 1000,
					}
				);
				user = refreshed;
			} else {
				return res.status(401).send('Invalid authorization token.');
			}
		}
		if (
			user &&
			'access_token' in user &&
			'expires_in' in user &&
			'refresh_token' in user &&
			'scope' in user &&
			'token_type' in user
		) {
			if (user.scope != scope.join(' '))
				return res.status(401).send('Invalid authorization token scopes.');

			req.user = (user as unknown) as User;
			next();
		} else {
			res.status(401).send('The authorization token is malformed.');
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
			res.clearCookie('token').redirect('/');
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
			const old = req.query.type == 'old';
			if (req.query.error as string)
				return res
					.cookie('error', req.query.error)
					.redirect(old ? '/dashboard/error' : '/dashboard/done');
			const code: string | undefined = req.query.code as string;
			if (!code) return res.status(400).send('No access code provided.');

			let response;
			try {
				response = await oAuth.tokenRequest({
					code,
					scope,
					grantType: 'authorization_code',
					redirectUri:
						req.protocol +
						'://' +
						req.get('host') +
						`/dashboard/callback${old ? '?type=old' : ''}`,
				});
			} catch (error) {
				if ('code' in error && error.code == 400)
					return res.status(400).send('Invalid access code.');
				return next(error);
			}

			if (response.scope != scope.join(' ')) {
				res.redirect(old ? '/dashboard/oldLogin' : '/dashboard/authorize');
			} else {
				const url = old ? req.cookies.prev ?? '/dashboard' : '/dashboard/done';
				if (old && req.cookies.prev) res.clearCookie('prev');
				res
					.cookie('success', true)
					.cookie(
						'token',
						await sign(response, tokenSecret, {
							expiresIn: response.expires_in,
						}),
						{
							httpOnly: true,
							maxAge: response.expires_in * 1000,
						}
					)
					.redirect(url);
			}
		})

		.use('/api', checkToken, dashboardAPIController(bot, oAuth));
};

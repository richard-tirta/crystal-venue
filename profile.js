
exports.init = function (req, res) {

	const { body, validationResult } = require('express-validator');
	const app = require('./app.js');
	const auth = require('./auth');
	const dbQuery = require('./db-query');
	const cookieParser = require("cookie-parser");
	const cors = require('cors');
	const doteenv = require('dotenv');
	const express = require('express');
	const fetch = require('node-fetch');
	const jwt = require('jsonwebtoken');

	doteenv.config();

	const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
	const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
	const TOKEN_SECRET = process.env.TOKEN_SECRET;

	app.use(cookieParser());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(cors());

	app.get('/profile', function (req, res) {
		// res.status(200).send({ success: true })
		let userData = undefined;
		let isMember = false;

		async function getUser(token, token_type) {

			fetch('https://discord.com/api/users/@me', {
				headers: {
					authorization: `${token_type} ${token}`,
				}
			})
				.then(
					function (response) {
						response.json().then(function (data) {
							userData = data;
						});
					}
				)
				.catch(err => console.log(err));

			fetch('https://discord.com/api/users/@me/guilds', {
				headers: {
					authorization: `${token_type} ${token}`,
				}

			})
				.then(
					function (response) {
						response.json().then(function (guildData) {
							if (!guildData) {
								return;
							}
							guildData.find(function (guild, index) {
								if (parseInt(guild.id) == 758143077701124137) {
									isMember = true;
								}
							});
							userData.isMember = isMember;

							dbQuery.getUserByUserId(userData.id).then((response) => {

								// 12h
								const timer = 43200000;
								const isHttps = process.env.NODE_ENV !== 'development' ? true : false;

								if (response.length < 1) {
									userData.haveVenue = false;
									dbQuery.addNewUserToDb(userData);
								}

								let jwtToken = jwt.sign({ userId: userData.id }, TOKEN_SECRET, {
									expiresIn: timer // expires in 24 hours
								});

								res.cookie(
									'token', jwtToken, {
										maxAge: timer,
										httpOnly: true,
										secure: isHttps,
									})
									.redirect('/profile.html');
							})
						});
					}
				)
				.catch(err => console.log(err));
		}

		if (req.query.code) {
			const data = {
				client_id: DISCORD_CLIENT_ID,
				client_secret: DISCORD_CLIENT_SECRET,
				grant_type: "authorization_code",
				code: req.query.code,
				redirect_uri: process.env.REDIRECT_URI,
				scope: "identify guilds"
			};

			fetch('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: new URLSearchParams(data),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded;'
				}

			})
				.then(
					function (response) {
						response.json().then(function (data) {
							getUser(data.access_token, data.token_type);
						});
					}
				)
				.catch(err => console.log(err));

		} else {
			res.redirect(process.env.REDIRECT_DISCORD);
		}
	});

	app.get('/userInfo', (req, res) => {
		let cookieAuth = auth.init(req);

		if (!cookieAuth) {
			res.status(400).send('No Cookie found').redirect('/profile');
		}

		const userId = cookieAuth['userId'];
		dbQuery.getUserByUserId(userId).then((response) => {
			if (response[0].havevenue) {
				console.log('user have venue, fetching venue');
				dbQuery.getVenueByUserId(userId).then((venue) => {
					response[0].venue = venue;
					if (response[0].venue[0].haveevents) {
						console.log('venue have events, fetching events');
						dbQuery.getEventsByVenueId(venue[0].id).then((events) => {
							response[0].venue[0].events = events;
							console.log('response', response);
							res.send(response);
						}).catch(err => console.log(err));
					} else {
						res.send(response);
					}
				}).catch(err => console.log(err));
			} else {
				res.send(response);
			}
		}).catch(err => console.log(err));
	});

	app.post('/updateBday', [
		body('userId')
			.escape()
			.not()
			.isString(),
		body('birthday')
			.escape()
			.not()
			.isString(),
	], (req, res) => {
		const cookieAuth = auth.init(req);
		const userIdAuth =  cookieAuth ? cookieAuth['userId'] : null;

		if (userIdAuth !== req.body.userId) {
			res.redirect('/profile');
			return;
		}

		console.log('updateBday POST received', req.body);

		const eventObject = {
			userId: req.body.userId,
			birthday: req.body.birthday,
		}
		dbQuery.updateBday(eventObject);
		res.status(200).send({ success: true })

	});
}

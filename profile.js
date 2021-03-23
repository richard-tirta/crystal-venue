const { json } = require('express');

exports.init = function (req, res) {

	const { body, validationResult } = require('express-validator');
	const app = require('./app.js');
	const auth = require('./auth');
	const cookieParser = require("cookie-parser");
	const cors = require('cors');
	const doteenv = require('dotenv');
	const express = require('express');
	const fetch = require('node-fetch');
	const jwt = require('jsonwebtoken');
	const Pool = require('pg').Pool;

	doteenv.config();

	const pool = process.env.DATABASE_URL
		? new Pool({
			connectionString: process.env.DATABASE_URL,
			ssl: {
				rejectUnauthorized: false
			}
		})
		: new Pool({
			user: process.env.DB_USER,
			host: process.env.DB_HOST,
			database: process.env.DB_DATABASE,
			password: process.env.DB_PASSWORD,
			port: process.env.DB_PORT,
		});

	const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
	const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
	const TOKEN_SECRET = process.env.TOKEN_SECRET;

	app.use(cookieParser());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(cors());

	const getUserByUserId = (userId) => {
		const query = 'SELECT * FROM users WHERE userid = $1';

		return new Promise(function (resolve, reject) {
			pool.query(query, [userId], (err, response) => {
				if (err) {
					console.log('getUserByUserId error', err)
					reject(0);
				} else {
					resolve(response.rows);
				}
			})
		});
	}

	const getVenueByUserId = (userId) => {
		const query = 'SELECT * FROM venues WHERE userid = $1';

		return new Promise(function (resolve, reject) {
			pool.query(query, [userId], (err, response) => {
				if (err) {
					console.log('getVenueByUserId error', err)
					reject(0);
				} else {
					resolve(response.rows);
				}
			})
		});
	}

	const getEventsByVenueId = (venueId) => {
		const query = 'SELECT * FROM events WHERE venueid = $1';

		return new Promise(function (resolve, reject) {
			pool.query(query, [venueId], (err, response) => {
				if (err) {
					console.log('getEventsByVenueId error', err)
					reject(0);
				} else {
					resolve(response.rows);
				}
			})
		});
	}

	const addNewUserToDb = (data) => {
		console.log('GOING TO ADD NEW USER TO DB', data);
		const { id, username, discriminator, avatar, isMember, haveVenue } = data

		pool.query('INSERT INTO users (userid, username, discriminator, avatar, isMember, haveVenue ) VALUES ($1, $2, $3, $4, $5, $6)', [id, username, discriminator, avatar, isMember, haveVenue], (error, results) => {
			if (error) {
				throw error
			}
			console.log('User added');
		})
	}

	const updateBday = (data) => {
		console.log('GOING TO UPDATE BDAY TO DB', data);
		const { userId, birthday } = data

		pool.query(
			'UPDATE users SET birthday = $1 WHERE userid = $2',
			[birthday, userId],
			(error, results) => {
				if (error) {
					throw error
				}
				console.log('Users bday is updated');
			}
		)
	}

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
							guildData.find(function (guild, index) {
								if (parseInt(guild.id) == 758143077701124137) {
									isMember = true;
								}
							});
							userData.isMember = isMember;

							getUserByUserId(userData.id).then((response) => {

								const timer = 86400;

								if (response.length < 1) {
									userData.haveVenue = false;
									addNewUserToDb(userData);
								}

								let jwtToken = jwt.sign({ userId: userData.id }, TOKEN_SECRET, {
									expiresIn: timer // expires in 24 hours
								});

								res.cookie(
									'token', jwtToken, {
									maxAge: timer,
									httpOnly: true
								});

								res.redirect('/profile.html');
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
			res.status(400);
			res.send('No Cookie found');
			res.redirect('/profile');
		}

		const userId = cookieAuth['userId'];
		getUserByUserId(userId).then((response) => {
			if (response[0].havevenue) {
				//console.log('user have venue, fetching venue');
				getVenueByUserId(userId).then((venue) => {
					response[0].venue = venue;
					if (response[0].venue[0].haveevents) {
						//console.log('venue have events, fetching events');
						getEventsByVenueId(venue[0].id).then((events) => {
							response[0].venue[0].events = events;
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
		const userIdAuth = cookieAuth['userId'];

		if (userIdAuth !== req.body.userId) {
			res.redirect('/profile');
			return;
		}

		console.log('updateBday POST received', req.body);

		const eventObject = {
			userId: req.body.userId,
			birthday: req.body.birthday,
		}
		updateBday(eventObject);
		res.status(200).send({ success: true })

	});
}

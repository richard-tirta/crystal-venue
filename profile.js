const { json } = require('express');

exports.init = function (req, res) {

	const { body, validationResult } = require('express-validator');
	const app = require('./app.js');
	const cookieParser = require("cookie-parser");
	const cors = require('cors');
	const doteenv = require('dotenv');
	const express = require('express');
	const fetch = require('node-fetch');
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

	app.use(cookieParser());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(cors());

	const getAppCookies = (req) => {
		if (req.headers.cookie) {
			const rawCookies = req.headers.cookie.split('; ');
			const parsedCookies = {};
			rawCookies.forEach(rawCookie => {
				const parsedCookie = rawCookie.split('=');
				parsedCookies[parsedCookie[0]] = parsedCookie[1];
			});
			return parsedCookies;
		} else {
			return undefined;
		}
	};

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
								if (response.length < 1) {
									userData.haveVenue = false;
									addNewUserToDb(userData);
								}
								res.cookie(
									'userId', userData.id, {
									maxAge: 24 * 60 * 60 * 60,
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

	app.get('/discord', (req, res) => {
		let gotCookie = false;
		let userData = undefined;
		//console.log('hmmmm', req.headers.cookie);
		if (req.headers.cookie) {
			if (getAppCookies(req, res)['userId']) {
				gotCookie = true;
			}
		}
		//console.log('hmmmm2', gotCookie, getAppCookies(req, res));
		if (gotCookie) {
			const userId = getAppCookies(req, res)['userId'];
			getUserByUserId(userId).then((response) => {
				if (response[0].havevenue) {
					console.log('user have venue, fetching venue');
					getVenueByUserId(userId).then((venue) => {
						response[0].venue = venue;
						if (response[0].venue[0].haveevents) {
							console.log('venue have events, fetching events');
							getEventsByVenueId(venue[0].id).then((events) => {
								response[0].venue[0].events = events;
								res.send(response);
							});
						} else {
							res.send(response);
						}
					})
				} else {
					res.send(response);
				}
			})
		} else {
			res.status(400);
			res.send('No Cookie found');
		}
	});
}

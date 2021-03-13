const { json } = require('express');

exports.init = function (req, res) {

	const express = require('express');
	const app = require('./app.js');
	const fetch = require('node-fetch');
	const cookieParser = require("cookie-parser");
	//const bodyParser = require('body-parser');
	const cors = require('cors');
	const { body, validationResult } = require('express-validator');
	const Pool = require('pg').Pool

	const pool = new Pool({
		user: 'me',
		host: 'localhost',
		database: 'cva',
		password: 'password',
		port: 5432,
	})

	const DISCORD_CLIENT_ID = '819420216583913532';
	const DISCORD_CLIENT_SECRET = 'whvp1V0pnXoMsm6O1zFqAQ4l8IDvBMB5';

	app.use(cookieParser());
	// app.use(bodyParser.json())
	// app.use(bodyParser.urlencoded({ extended: true }));
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(cors());

	// id: '797508055960256554',
	// name: 'Eagle Dragon Leather Bar',
	//id: '758143077701124137',
	// name: 'Crystal Venue Association',

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

	const addNewVenueToDb = (data) => {
		console.log('GOING TO ADD NEW VENUE TO DB', data);
		const { userId, venueName, venueDescription, venueWorld, venueLocation, venueWard, venuePlot, venueAetheryte, venueWebsite, venueType1, venueType2, venueType3, isMature } = data

		pool.query('INSERT INTO venues (userid, name, description, world, location, ward, plot, aetheryte, website, type1, type2, type3, ismature) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [userId, venueName, venueDescription, venueWorld, venueLocation, venueWard, venuePlot, venueAetheryte, venueWebsite, venueType1, venueType2, venueType3, isMature], (error, results) => {
			if (error) {
				throw error
			}
			console.log('Venue added');
		})

		pool.query(
			'UPDATE users SET haveVenue = true WHERE userid = $1',
			[data.userId],
			(error, results) => {
				if (error) {
					throw error
				}
				console.log('Users updated to have venue');
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
								if (parseInt(guild.id) == 797508055960256554) {
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
				redirect_uri: "http://localhost:3000/profile",
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
			res.redirect('https://discord.com/api/oauth2/authorize?client_id=819420216583913532&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fprofile&response_type=code&scope=identify%20guilds');
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
				console.log('hmmm', response[0].havevenue);
				if (response[0].havevenue) {
					getVenueByUserId(userId).then((venue) => {
						response[0].venue = venue;
						res.send(response);
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

	app.post('/addVenue', [
		body('userId')
			.escape()
			.not()
			.isString(),
		body('venueName')
			.escape()
			.isString(),
		body('venueDescription')
			.escape()
			.isString(),
		body('venueWorld')
			.escape()
			.isString(),
		body('venueLocation')
			.escape()
			.isString(),
		body('venueWard')
			.escape()
			.not()
			.isString(),
		body('venuePlot')
			.escape()
			.not()
			.isString(),
		body('venueAetheryte')
			.escape()
			.isString(),
		body('venueWebsite')
			.escape()
			.isString(),
		body('venueType1')
			.escape()
			.isString(),
		body('venueType2')
			.escape()
			.isString(),
		body('venueType3')
			.escape()
			.isString(),
		body('isMature')
			.escape()
			.isBoolean()
	], function (req, res) {
		console.log('addVenue POST received', req.body);

		const venueObject = {
			userId: req.body.userId,
			venueName: req.body.venueName,
			venueDescription: req.body.venueDescription,
			venueWorld: req.body.venueWorld,
			venueLocation: req.body.venueLocation,
			venueWard: req.body.venueWard,
			venuePlot: req.body.venuePlot,
			venueAetheryte: req.body.venueAetheryte,
			venueWebsite: req.body.venueWebsite,
			venueType1: req.body.venueType1,
			venueType2: req.body.venueType2,
			venueType3: req.body.venueType3,
			isMature: req.body.isMature,
		}
		addNewVenueToDb(venueObject);
		res.status(200).send({ success: true })

	});

}

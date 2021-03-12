
exports.init = function (req, res) {

	const app = require('./app.js');
	const fetch = require('node-fetch');
	const cookieParser = require("cookie-parser");
	const bodyParser = require('body-parser');
	const cors = require('cors');

	const DISCORD_CLIENT_ID = '819420216583913532';
	const DISCORD_CLIENT_SECRET = 'whvp1V0pnXoMsm6O1zFqAQ4l8IDvBMB5';

	let dbCache = [];

	app.use(cookieParser());
	app.use(bodyParser.json())
	app.use(cors())

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

							if (dbCache.length < 1) {
								dbCache.push(userData)
								res.cookie(
									'userId', userData.id, {
									maxAge: 24 * 60 * 60,
									httpOnly: true
								});
							} else {
								dbCache.find(function (profile, index) {
									if (parseInt(profile.id) == parseInt(userData.id)) {
										return;
									} else {
										dbCache.push(userData);

										res.cookie(
											'userId', userData.id, {
											maxAge: 24 * 60 * 60,
											httpOnly: true
										});

									}
								});
							}
							res.redirect('/profile.html');
						});
					}
				)
				.catch(err => console.log(err));
		}

		if (getAppCookies(req, res)) {
			res.redirect('/profile.html');
		} else {
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
		}
	});

	app.get('/discord', (req, res) => {
		const userId = getAppCookies(req, res)['userId'];
		userInfo = dbCache.find(user => parseInt(user.id) == userId);
		res.send(userInfo);
	});

}

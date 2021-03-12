
exports.init = function (req, res) {

	const app = require('./app.js');
	const fetch = require('node-fetch');
	const DISCORD_CLIENT_ID = '819420216583913532';
	const DISCORD_CLIENT_SECRET = 'whvp1V0pnXoMsm6O1zFqAQ4l8IDvBMB5';
	
	//797508055960256554
		//811993757196353536
		//797546078034853910
		// id: '797508055960256554',
		// name: 'Eagle Dragon Leather Bar',
		//id: '758143077701124137',
		// name: 'Crystal Venue Association',

	app.get('/discord', function (req, res) {
		let userData = [];
		let data = {
			client_id: DISCORD_CLIENT_ID,
			client_secret: DISCORD_CLIENT_SECRET,
			grant_type: "authorization_code",
			code: req.query.code,
			redirect_uri: "http://localhost:3000/profile.html",
			scope: "identify guilds"
		};
		let isMember = false;
		

		function getUser(token, token_type) {
			
			fetch('https://discord.com/api/users/@me', {
				headers: {
					authorization: `${token_type} ${token}`,
				}
				
			})
				.then(
					function (response) {
						response.json().then(function (data) {
							userData.push(data);
							console.log('fetch completed for userData', data);
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
							for (let i = 0; i < guildData.length; i++) {
								guildData[i].id == 797508055960256554 ? isMember = true : null;
								console.log('checking if user is Eagle Dragon member', isMember);
							}
					
							//userData.push({'isMember' : isMember});
							//res.send(userData);
						});
					}
				)
				.catch(err => console.log(err));
		}

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
	});
	
}

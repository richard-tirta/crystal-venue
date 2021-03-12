const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');


const DISCORD_CLIENT_ID = '819420216583913532';
const DISCORD_CLIENT_SECRET = 'whvp1V0pnXoMsm6O1zFqAQ4l8IDvBMB5';

const app = express();
const fetch = require('node-fetch');

const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2();


const port = process.env.PORT || 3000;

module.exports = app;

var server = app.listen(port, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('Example app listening at http://%s:%s', host, port)
});

app.use(express.static(__dirname + '/dist/'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.get('/venue', function (req, res) {
	res.redirect('/venue.html');
	// res.status(200).send({ success: true })
});

app.get('/profile', function (req, res) {
	console.log('GET request at profile made', req.query)
	res.redirect('/profile.html');
	// res.status(200).send({ success: true })
	fetch('https://discord.com/api/oauth2/token', {
				method: 'GET',
				mode: 'cors',
                data: {
                    client_id: DISCORD_CLIENT_ID,
                    client_secret: DISCORD_CLIENT_SECRET,
                    code: req.query.code,
                    scope: "identify guilds",
                    grantType: "authorization_code",
                    redirectUri: "https://dry-badlands-14718.herokuapp.com/profile"
                },
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
	})
		.then(
			function (response) {
				if (response.status !== 200) {
					console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
				}
				response.json().then(function (data) {
					console.log('horray', data);
				});
			}
		)
        .catch(err => console.log(err));
});



//https://discord.com/api/oauth2/token

app.get('/discord', function (req, res) { 
	console.log('POST request for Discord made', req.query.code);
	oauth.tokenRequest({
		clientId: DISCORD_CLIENT_ID,
		clientSecret: DISCORD_CLIENT_SECRET,
	 
		code: req.query.code,
		scope: "identify guilds",
		grantType: "authorization_code",
		
		redirectUri: "https://dry-badlands-14718.herokuapp.com/profile",
	}).then(console.log)
});

app.get('/about', function (req, res) {
	res.redirect('/about.html');
	// res.status(200).send({ success: true })
});


const { body } = require('express-validator/check');


//The 404 Route (ALWAYS Keep this as the last route)
// app.use(function (req, res, next) {
// 	res.status(404).redirect('/404.html');
// 	console.log('Sending 404, this was requested:', req.url);
// })

const express = require('express');
const helmet = require('helmet');
const listings = require('./server/listings');
const path = require('path');
const profile = require('./server/profile');
const venueAdmin = require('./server/admin-venue');
const eventAdmin = require('./server/admin-event');
const upload = require('./server/upload');

const app = express();
const port = process.env.PORT || 3000;

module.exports = app;

var server = app.listen(port, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('Example app listening at http://%s:%s', host, port)
});

app.use(express.static(__dirname + '/dist/'));


app.use(
	helmet.contentSecurityPolicy({
		directives: {
			...helmet.contentSecurityPolicy.getDefaultDirectives(),
			"script-src": ["'self'", "discordapp.com"],
		},
	})
);

app.get('/', function (req, res) {
	console.log('/ requested', req.query.code);
	// res.status(200).send({ success: true })
});

app.get('/venue', function (req, res) {
	res.redirect('/venue.html');
	// res.status(200).send({ success: true })
});

app.get('/about', function (req, res) {
	res.redirect('/about.html');
	// res.status(200).send({ success: true })
});

listings.init();
profile.init();
venueAdmin.init();
eventAdmin.init();
upload.init();

//The 404 Route (ALWAYS Keep this as the last route)
app.use(function (req, res, next) {
	res.status(404).redirect('/404.html');
	console.log('Sending 404, this was requested:', req.url);
})
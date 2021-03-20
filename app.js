const express = require("express");
const path = require("path");
const profile = require('./profile');
const venueAdmin = require('./venueAdmin');
const eventAdmin = require('./eventAdmin');
const upload = require('./upload');

const app = express();
const port = process.env.PORT || 3000;

module.exports = app;

var server = app.listen(port, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('Example app listening at http://%s:%s', host, port)
});

app.use(express.static(__dirname + '/dist/'));


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

profile.init();
venueAdmin.init();
eventAdmin.init();
upload.init();

//The 404 Route (ALWAYS Keep this as the last route)
app.use(function (req, res, next) {
	res.status(404).redirect('/404.html');
	console.log('Sending 404, this was requested:', req.url);
})

const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const app = express();

var gallery = require('./gallery');

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
	res.redirect('/profile.html');
	// res.status(200).send({ success: true })
});

app.get('/about', function (req, res) {
	res.redirect('/about.html');
	// res.status(200).send({ success: true })
});


const { body } = require('express-validator/check');


//The 404 Route (ALWAYS Keep this as the last route)
app.use(function (req, res, next) {
	res.status(404).redirect('/404.html');
	console.log('Sending 404, this was requested:', req.url);
})

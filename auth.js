
exports.init = function (req) {

	const app = require('./app.js');
    const cookieParser = require("cookie-parser");
	const express = require('express');
	const jwt = require('jsonwebtoken');

    app.use(cookieParser());
	app.use(express.json());
	
	const TOKEN_SECRET = process.env.TOKEN_SECRET;

    const getAppCookies = (req) => {

		const rawCookies = req.headers.cookie.split('; ');
		const parsedCookies = {};
		let decodedToken = undefined;

		rawCookies.forEach(rawCookie => {
			const parsedCookie = rawCookie.split('=');
			parsedCookies[parsedCookie[0]] = parsedCookie[1];
		});

		if (parsedCookies.token) {		
			jwt.verify(parsedCookies.token, TOKEN_SECRET, function (err, decoded) {
				if (err) {
					console.log('JWT Verify error', err);
					return undefined;
				}
				decodedToken = decoded;
			});
			return decodedToken;
		} else {
			return undefined;
		}
	};

	return getAppCookies(req);

}

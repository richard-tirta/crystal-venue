
exports.init = function (req, res) {

    const cookieParser = require("cookie-parser");
    const express = require('express');

    app.use(cookieParser());
    app.use(express.json());


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

}

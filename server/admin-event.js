
exports.init = function (req, res) {

	const { body, validationResult } = require('express-validator');
	const app = require('../app.js');
	const auth = require('./auth');
	const dbQuery = require('./db-query');
	const express = require('express');

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());

	app.post('/addEvent', [
		body('userId')
			.escape()
			.notEmpty()
			.not()
			.isString(),
		body('venueId')
			.escape()
			.notEmpty()
			.not()
			.isString(),
		body('venueName')
			.escape()
			.notEmpty()
			.isString(),
		body('eventName')
			.escape()
			.notEmpty()
			.isString(),
		body('venueSubTitle')
			.escape()
			.isString(),
		body('eventTime')
			.escape()
			.notEmpty()
			.not()
			.isString(),
		body('eventIsMature')
			.escape()
			.isBoolean(),
		body('eventType1')
			.escape()
			.notEmpty()
			.isString(),
		body('eventType2')
			.escape()
			.isString(),
		body('eventType3')
			.escape()
			.isString(),
	], (req, res) => {
		console.log('addEvent POST received', req.body);

		const cookieAuth = auth.init(req);
		const userIdAuth =  cookieAuth ? cookieAuth['userId'] : null;

		if (userIdAuth !== req.body.userId) {
			res.redirect('/profile');
			return;
		}

		// make sure following is not empty
		if (
			!req.body.userId
			&& !req.body.venueid
			&& !req.body.venueName
			&& !req.body.eventName
			&& !req.body.eventTime
			&& !req.body.eventType1
		) {
			res.status(400).send({ success: false });
			return;
		}

		const eventObject = {
			userId: req.body.userId,
			venueId: req.body.venueId,
			venueName: req.body.venueName,
			eventName: req.body.eventName,
			eventSubTitle: req.body.eventSubTitle,
			eventTime: req.body.eventTime,
			eventIsMature: req.body.eventIsMature,
			eventType1: req.body.eventType1,
			eventType2: req.body.eventType2,
			eventType3: req.body.eventType3,
		}
		dbQuery.addNewEventToDb(eventObject);
		res.status(200).send({ success: true })

	});

	app.delete('/deleteEvent', [
		body('eventId')
			.escape()
			.notEmpty()
			.not()
			.isString(),
		body('venueId')
			.escape()
			.notEmpty()
			.not()
			.isString(),
		body('eventsCount')
			.escape()
			.notEmpty()
			.not()
			.isString()
	], (req, res) => {
		console.log('deleteEvent DELETE received', req.body);

		const cookieAuth = auth.init(req);
		const userIdAuth =  cookieAuth ? cookieAuth['userId'] : null;

		if (!userIdAuth) {
			res.redirect('/profile');
			return;
		}

		// make sure following is not empty
		if (!req.body.eventId && !req.body.venueid) {
			res.status(400).send({ success: false });
			return;
		}

		const eventObject = {
			eventId: req.body.eventId,
			venueId: req.body.venueId,
			eventsCount: req.body.eventsCount,
		}
		dbQuery.deleteEventByEventId(eventObject);
		res.status(200).send({ success: true })
	});

}

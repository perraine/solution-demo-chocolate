"use strict";

const EVT = require("evrythng");
const reponse = {};
const cities = require("../data/cities.json");
const numberOfCities = cities.length;
const timeInterval = 5000;
let actionTypes = [];
var logger;

function start(appApiKey, body, log) {
	logger = log;
	logger.info("Starting Simulation ...");
	setApplicationLocation(EVT, body);
	var app = new EVT.App(appApiKey);

	getUser(app)
		.then(user => {
			createScans(user, body);
		})
		.catch(err => {
			logger.info("Simulation Not Run : ", err);
		});
}

function getUser(app) {
	return new Promise((resolve, reject) => {
		app
			.appUser()
			.create({
				anonymous: true
			})
			.then(function(anonymousUser) {
				logger.info("Created anonymous user");
				resolve(anonymousUser);
			})
			.catch(err => {
				console.log("anonymous user creation error : ", err);
				reject(err);
			});
	});
}

function setApplicationLocation(EVT, body) {
	if (body.region.toUpperCase() === "EU") {
		EVT.setup({
			apiUrl: "https://api-eu.evrythng.com"
		});
	} else {
		EVT.setup({
			apiUrl: "https://api.evrythng.com"
		});
	}
}

function createScans(user, body) {
	let numberOfScans = 10;
	if (!body.numberOfScans) {
		numberOfScans = body.numberOfScans;
	}

	let simulationCities = [];

	user.actionType().read().then(at => {
		actionTypes = at;
		user
			.thng()
			.read()
			.then(thngs => {
				console.log(thngs.length);
				for (var i = 0; i < numberOfScans; i++) {
					setTimeout(
						simulateScan,
						i * timeInterval,
						randomPlace(),
						user,
						randomThng(thngs)
					);
				}
			})
			.catch(err => {
				console.log(err);
			});
	});
}

function simulateScan(place, user, thngId) {
	let actionContents = {};
	actionContents.locationSource = "sensor";
	actionContents.location = {};
	actionContents.location.position = {};
	actionContents.location.position.type = "Point";
	actionContents.location.position.coordinates = [];
	actionContents.location.position.coordinates.push(place.lng);
	actionContents.location.position.coordinates.push(place.lat);
	actionContents.type = randomAction();
	console.log(thngId);
	user.thng(thngId).read().then(thng => {
		thng
			.action(actionContents.type)
			.create(actionContents)
			.then(a => {
				console.log("action added");
			})
			.catch(err => {
				console.log(err);
			});
	});

	return actionContents;
}

function randomPlace() {
	return cities[getRandomInt(0, numberOfCities)];
}

function randomThng(thngs) {
	return thngs[getRandomInt(0, thngs.length - 1)].id;
}

function randomAction() {
	return actionTypes[getRandomInt(0, actionTypes.length - 1)].name;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
	start
};

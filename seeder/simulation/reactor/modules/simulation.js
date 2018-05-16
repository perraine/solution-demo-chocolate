// grey market checker

"use strict";

// Essentially we are checking the history
const cities = require("../data/cities.json");
const numberOfCities = cities.length;
const numberOfScans = 10;
const timeInterval = 5000;
let simulationCities = [];
let actionTypes = [];

function run(app, event) {
	app.actionType().read().then(at => {
		actionTypes = at;
		app
			.thng()
			.read()
			.then(thngs => {
				console.log(thngs.length);
				logger.info("Running Simulation");
				for (var i = 0; i < numberOfScans; i++) {
					setTimeout(
						simulateScan,
						i * timeInterval,
						randomPlace(),
						app,
						event,
						randomThng(thngs)
					);
				}
			})
			.catch(err => {
				console.log(err);
			});
	});
}

module.exports = {
	run
};

function simulateScan(place, app, event, thngId) {
	logger.info("Add Scan here : " + place.city);
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
	app.thng(thngId).read().then(thng => {
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

function filterThngs() {}

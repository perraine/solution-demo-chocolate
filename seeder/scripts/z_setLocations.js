"use strict";
const CASE_ID = "UkySHrkWG3ExEUftFptEhdrg";

const config = require("evt-config"), moment = require("moment");
// globals
let cfg = {};
let scope = {};
let operator = {};

const EVT = require("evrythng-extended");

config
	.get("kidger-demo")
	.then(settings => {
		// now do my other stuff
		if (validSettings(settings)) {
			cfg = settings;
			let l = getLocationData();
			console.log("l : " + JSON.stringify(l));

			//loadData();
		}
	})
	.catch(err => {
		console.log("Error  : ", err);
	});

function loadData() {
	EVT.setup({
		apiUrl: cfg.apiUrl
	});

	const operator = new EVT.Operator(cfg.operatorKey);

	clearLocations(CASE_ID);
}

function clearLocations(id) {
	// have to read the redirector first, modify it then put it back
	EVT.api({
		apiUrl: cfg.apiUrl,
		method: "delete",
		url: "/thngs/" + id + "/location",
		authorization: cfg.operatorKey
	})
		.then(function() {
			addLocations();
		})
		.catch(function(err) {
			console.log("Error", err);
		});
}

function addLocations() {
	let locationData = getLocationData();
	EVT.api({
		apiUrl: cfg.apiUrl,
		method: "post",
		url: "/thngs/" + id + "/location",
		data: locationData,
		authorization: cfg.operatorKey
	})
		.then(function(resp) {
			console.log("Updated Lcoations");
		})
		.catch(function(err) {
			console.log("Error", err);
		});
}

function getLocationData() {
	// Add A Case Journey starting in Bordwax, then LeHavre, 4 weeks to Singapore, then Shanghai 3 weeks Later
	// Bordeaux 10 weeks ago
	let locations = [];
	let location = {};
	location.timestamp = timestampBackFromNow(70);
	location.position = getPos("Bordeaux");
	locations.push(cloneObj(location));
	location.timestamp = timestampBackFromNow(60);
	location.position = getPos("Le Havre");
	locations.push(cloneObj(location));
	location.timestamp = timestampBackFromNow(40);
	location.position = getPos("Moscow");
	locations.push(cloneObj(location));
	location.timestamp = timestampBackFromNow(20);
	location.position = getPos("St. Petersburg");
	locations.push(cloneObj(location));

	console.log("locations : " + JSON.stringify(locations));
	return locations;
}

function getPos(place) {
	let placeData = getPlaceData(place);
	let placegeo = {};
	placegeo.type = "Point";
	placegeo.coordinates = [];
	placegeo.coordinates.push(placeData.lng);
	placegeo.coordinates.push(placeData.lat);
	return placegeo;
}

function getPlaceData(city) {
	const cities = require("../simulation/reactor/data/cities.json");
	let found = cities.filter(place => {
		return city === place.city;
	});
	return found[0];
}

function validSettings(accountSettings) {
	if (
		accountSettings.operatorKey &&
		accountSettings.projectId &&
		accountSettings.defaultUrl &&
		accountSettings.appKey &&
		accountSettings.kidgerAppUrl &&
		accountSettings.shortUrl
	) {
		return true;
	} else {
		console.error("Check settings file");
		return false;
	}
}

function timestampBackFromNow(increment) {
	let ts = moment().subtract(increment, "days").valueOf();
	console.log(ts);
	return ts;
}

// return random number
function generateRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function cloneObj(from) {
	return JSON.parse(JSON.stringify(from));
}

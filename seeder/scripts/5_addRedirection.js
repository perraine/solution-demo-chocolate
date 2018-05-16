"use strict";

const config = require("evt-config");
// globals
let cfg = {};
let scope = {};
let operator = {};

const EVT = require("evrythng-extended");

const redirectionTemplate = require("../templates/redirector.json");

config
	.get("kidger-demo")
	.then(settings => {
		// now do my other stuff
		if (validSettings(settings)) {
			cfg = settings;
			loadData();
		}
	})
	.catch(err => {
		console.log("Error  : ", err);
	});

function loadData() {
	EVT.setup({
		apiUrl: cfg.apiUrl
	});

	const trustedApp = new EVT.TrustedApp(cfg.trustedAppKey);

	trustedApp.product().read().then(products => {
		// do first product
		// if (products.length > 1) {
		// 	console.log("Setting first product : ", products[0].id);
		// }
		let newRedirection = parseTemplate(products[0].id, products[0].name);
		addRedirector(newRedirection);
	});
}

function parseTemplate(baseProductId, baseProductName) {
	// update the match Data
	let newRedirection = redirectionTemplate;
	newRedirection.rules[0].match = redirectionTemplate.rules[0].match.replace(
		"{{PRODUCT_ID}}",
		baseProductId
	);
	newRedirection.rules[0].name = redirectionTemplate.rules[0].name.replace(
		"{{PRODUCT_NAME}}",
		baseProductName
	);
	newRedirection.rules[0].redirectUrl = redirectionTemplate.rules[0].redirectUrl.replace(
		"{{APP_API_KEY}}",
		cfg.appKey
	);
	newRedirection.rules[0].redirectUrl = redirectionTemplate.rules[0].redirectUrl.replace(
		"{{REGION}}",
		cfg.region
	);
	newRedirection.rules[0].redirectUrl = redirectionTemplate.rules[0].redirectUrl.replace(
		"{{KIDGER_URL}}",
		cfg.kidgerAppUrl
	);

	return newRedirection;
}

function addRedirector(newRedirection) {
	// have to read the redirector first, modify it then put it back
	EVT.api({
		apiUrl: cfg.apiUrl,
		method: "get",
		url: "/redirector",
		authorization: cfg.operatorKey
	})
		.then(function(redirections) {
			console.log(JSON.stringify(redirections));

			redirections.rules = newRedirection.rules.concat(redirections.rules);
			//console.log("newRedirection : " + JSON.stringify(redirections));

			EVT.api({
				apiUrl: cfg.apiUrl,
				method: "put",
				url: "/redirector",
				data: redirections,
				authorization: cfg.operatorKey
			})
				.then(function(resp) {
					console.log("Updated Redirections");
				})
				.catch(function(err) {
					console.log("Error", err);
				});
		})
		.catch(function(err) {
			console.log("Error", err);
		});
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

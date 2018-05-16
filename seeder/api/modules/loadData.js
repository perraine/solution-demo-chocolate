"use strict";

const EVT = require("evrythng-extended");

const addRuleToEvt = require("./addRuleToEvt.js");
const REACTOR_FILE_NAME = "./data/supply-chain-bundle.zip";

let operator,
	shortUrl,
	defaultUrl,
	opKey,
	apiUrl,
	appKey,
	appId,
	scope,
	awsRegion;
const kidgerAppUrl = "https://evt-sol-demos-02.netlify.com";

defaultUrl = "https://www.evrythng.com";

const applicationTemplate = require("../templates/application.json");
const newActionTypes = require("../templates/actionTypes.json");
const redirectionTemplate = require("../templates/redirector.json");

function start(auth, region, projectName) {
	setApiUrl(region);
	awsRegion = region;
	operator = new EVT.Operator(auth);
	opKey = auth;

	let newProject = {};
	newProject.name = projectName;
	operator
		.project()
		.create(newProject)
		.then(project => {
			project
				.application()
				.create(applicationTemplate)
				.then(application => {
					console.log("Project Id: ", project.id);
					console.log("Application Id", application.id);
					console.log("Application Key", application.appApiKey);
					appKey = application.appApiKey;
					appId = application.id;
					addActionTypes(project.id);
					addProducts(project.id);
					addRuleToEvt(apiUrl, opKey, project.id, appId, REACTOR_FILE_NAME)
						.then(function(resp) {
							console.log("Added Reactor to app : " + appId);
						})
						.catch(err => {
							console.log("Error  : ", err);
						});
				})
				.catch(err => {
					console.log("App Create error", err);
				});
		})
		.catch(err => {
			console.log("Project Create error", err);
		});
}

module.exports = {
	start
};

function setApiUrl(region) {
	if (region.toUpperCase() === "EU") {
		apiUrl = "https://api-eu.evrythng.com";
		EVT.setup({
			apiUrl: "https://api-eu.evrythng.com"
		});
		shortUrl = "https://eu.tn.gg";
	} else {
		apiUrl = "https://api.evrythng.com";
		EVT.setup({
			apiUrl: "https://api.evrythng.com"
		});
		shortUrl = "https://tn.gg";
	}
}

function addActionTypes(projectId) {
	console.log("Do Action Types");
	const scope = {
		params: {
			project: projectId
		}
	};

	let i = 0;

	newActionTypes.map(function(at) {
		operator
			.actionType()
			.create(at, filterByProject(projectId))
			.then(at => {
				console.log("action type created");
				if (i >= newActionTypes.length) {
					scopeActionTypes();
				}
			})
			.catch(err => {
				console.log(err.errors[0] + " : " + at.name);
			});
	});
}

function filterByProject(projectId) {
	var filter = {};
	filter.params = {};
	filter.params.project = projectId;
	return filter;
}

function scopeActionTypes() {
	newActionTypes.map(function(at) {
		operator.actionType(at.name).update({
			scopes: { projects: ["+all"], users: ["+all"] }
		});
	});
}

function addProducts(projectId) {
	console.log("Do Products");
	const newProducts = require("../templates/products.json");
	// set scope , so that products / thngs added to correct project

	scope = {
		params: {
			project: projectId
		}
	};

	newProducts.map(function(newProduct) {
		operator
			.product()
			.create(newProduct, scope)
			.then(function(product) {
				console.log("Created Product : ", product.id);
				// add thngs to product
				addRedirect(product.id, "product");
				createThngs(product);
				doRedirector();
			})
			.catch(err => {
				console.log("Error adding Product to EVT: ", err);
			});
	});
}

function createThngs(product) {
	let thngs = require("../templates/thngs.json");
	thngs.map(thng => {
		addThng(product, cloneObj(thng));
	});
}

function addThng(product, newThng) {
	// Nasty : stringify data for App
	if (newThng.customFields.provenance) {
		newThng.customFields.provenance = JSON.stringify(
			newThng.customFields.provenance
		);
	}
	if (newThng.customFields.sustainability) {
		newThng.customFields.sustainability = JSON.stringify(
			newThng.customFields.sustainability
		);
	}
	if (newThng.customFields.timeline) {
		newThng.customFields.timeline = JSON.stringify(
			newThng.customFields.timeline
		);
	}
	if (newThng.customFields.reviews) {
		newThng.customFields.reviews = JSON.stringify(newThng.customFields.reviews);
	}
	// link to product
	newThng.product = product.id;
	// set name
	if (newThng.customFields.state) {
		newThng.name = product.name + " - " + newThng.customFields.state;
	} else {
		newThng.name = product.name;
	}

	operator
		.thng()
		.create(newThng, scope)
		.then(function(thng) {
			console.log("Thng Added", thng.id);
			addRedirect(thng.id, "thng");
		})
		.catch(err => {
			console.log("Error adding thng to EVT: ", err);
		});
}
// should maybe use lodash, but doing the same shit anyway
function cloneObj(from) {
	return JSON.parse(JSON.stringify(from));
}

function addRedirect(objectId, objectType) {
	// no primary method for this, , use API
	EVT.api({
		method: "POST",
		apiUrl: shortUrl,
		url: "/redirections",
		data: {
			defaultRedirectUrl: defaultUrl,
			type: objectType,
			evrythngId: objectId
		},
		authorization: opKey
	}).catch(err => {
		// consol e.log('err on creating redirect for Object : ' + objectId);
		console.log("Redirect Problem : ", err);
		console.log(objectId);
		console.log(objectType);
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
		appKey
	);
	newRedirection.rules[0].redirectUrl = redirectionTemplate.rules[0].redirectUrl.replace(
		"{{REGION}}",
		awsRegion
	);
	newRedirection.rules[0].redirectUrl = redirectionTemplate.rules[0].redirectUrl.replace(
		"{{KIDGER_URL}}",
		kidgerAppUrl
	);

	console.log("newRedirection : " + newRedirection);

	return newRedirection;
}

function doRedirector() {
	operator.product().read(scope).then(products => {
		console.log("products[0].name : " + products[0].name);

		let newRedirection = parseTemplate(products[0].id, products[0].name);
		addRedirector(newRedirection);
	});
}

function addRedirector(newRedirection) {
	// have to read the redirector first, modify it then put it back
	EVT.api({
		apiUrl: apiUrl,
		method: "get",
		url: "/redirector",
		authorization: opKey
	})
		.then(function(redirections) {
			console.log("redirections : " + JSON.stringify(redirections));

			redirections.rules = newRedirection.rules.concat(redirections.rules);
			//console.log("newRedirection : " + JSON.stringify(redirections));

			EVT.api({
				apiUrl: apiUrl,
				method: "put",
				url: "/redirector",
				data: redirections,
				authorization: opKey
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

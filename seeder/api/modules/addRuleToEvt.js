"use strict";
const request = require("request");
const fs = require("fs");

function addRuleToEvt(url, key, project, application, zipfile) {
	return new Promise(function(resolve, reject) {
		const apiEndPoint =
			url +
			"/projects/" +
			project +
			"/applications/" +
			application +
			"/reactorScript?lambda=true&project=" +
			project;

		console.log("apiEndPoint : " + apiEndPoint);

		request(
			{
				url: apiEndPoint,
				method: "PUT",
				headers: {
					Authorization: key
				},
				formData: {
					file: fs.createReadStream(zipfile)
				}
			},
			(err, res, body) => {
				if (err) {
					reject(err);
				}
				console.log("body : " + JSON.stringify(body));

				resolve({ status: 100, body: body });
			}
		);
	});
}

module.exports = addRuleToEvt;

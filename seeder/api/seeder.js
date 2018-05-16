const REST_OK = "200";
const REST_ERROR = "400";

const simulator = require("./modules/simulator.js");
const dataLoad = require("./modules/loadData.js");

var request = require("request");

var bunyan = require("bunyan");
var logger = bunyan.createLogger({
	name: "evrythng-seeder-api",
	streams: [
		{
			level: "info",
			path: "./logs/proxy-info.log"
		},
		{
			level: "error",
			path: "./logs/proxy-error.log" // log ERROR and above to a file.
		}
	]
});

var express = require("express"); // call express
var app = express(); // define our app using express
var bodyParser = require("body-parser");
var cors = require("cors");

// allow CORS
app.use(cors());

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

//
startUp();

// posts validate against a schema if it exists for the endpoint and type
app.post("/simulator", function(req, res) {
	logger.info(req.body);
	let auth = req.get("authorization");
	simulator.start(auth, req.body, logger);
	res.status(REST_OK).json({ action: "simulator started" });
});
// posts validate against a schema if it exists for the endpoint and type
app.post("/seeder", function(req, res) {
	logger.info(req.body);
	let auth = req.get("authorization");
	dataLoad.start(auth, req.body.region, req.body.project);
	res.status(REST_OK).json({ action: "seeder" });
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log("schema api listening ... " + port);

// PASS READS / AND DELETES THROUGH
// =============================================================================

function startUp() {
	console.log("Started API");
}

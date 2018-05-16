const config = require("evt-config");
// make a glocal cfg
let cfg = {};

const EVT = require("evrythng-extended");

config
  .get("kidger-demo")
  .then(settings => {
    // now do my other stuff
    if (validSettings(settings)) {
      cfg = settings;
      runTests();
    }
  })
  .catch(err => {
    console.log("Error getting Configuration : ", err);
  });

function runTests() {
  var apiKey = cfg.trustedAppKey;
  var apiUrl = cfg.apiUrl;

  var actionData = require("./action.json");

  var event = {
    function: "onActionCreated",
    event: {
      action: actionData
    }
  };

  var EVT = require("evrythng-extended");

  function getLogger(level) {
    return function(msg) {
      var datetime = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      console.log(datetime + " [" + level + "\t]: " + msg);
    };
  }

  var logger = {
    debug: getLogger("debug"),
    info: getLogger("info"),
    warn: getLogger("warn"),
    error: getLogger("error")
  };

  function done() {
    logger.debug("Reporting logs to EVRYTHNG...");
    logger.debug("Script finished!");
  }

  EVT.setup({
    apiUrl: apiUrl
  });

  global.EVT = EVT;
  global.app = new EVT.TrustedApp(cfg.trustedAppKey);

  global.done = done;
  global.logger = logger;

  try {
    var reactor = require("../main.js");
    if (reactor[event.function]) {
      reactor[event.function](event.event);
    } else {
      console.log(
        "There are no event functions in the reactor script to execute."
      );
    }
  } catch (e) {
    logger.error("Could not execute reactor script: " + e.message);
  }
}

function validSettings(accountSettings) {
  if (
    accountSettings.operatorKey &&
    accountSettings.projectId &&
    accountSettings.defaultUrl &&
    accountSettings.kidgerAppUrl &&
    accountSettings.trustedAppKey &&
    accountSettings.shortUrl
  ) {
    console.log("All Required Settings provided");
    return true;
  } else {
    console.error("Check settings file");
    return false;
  }
}

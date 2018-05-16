"use strict";

const config = require("evt-config");
// make a glocal cfg
let cfg = {};

const EVT = require("evrythng-extended");

const newActionTypes = require("../templates/actionTypes.json");

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
    console.log("Error getting Configuration : " + err);
  });

function loadData() {
  EVT.setup({
    apiUrl: cfg.apiUrl
  });

  const operator = new EVT.Operator(cfg.operatorKey);

  const scope = {
    params: {
      project: cfg.projectId
    }
  };

  newActionTypes.map(function(at) {
    operator.actionType(at.name).update({
      scopes: { projects: ["+all"], users: ["+all"] }
    });
  });
}

function validSettings(accountSettings) {
  if (
    accountSettings.operatorKey &&
    accountSettings.projectId &&
    accountSettings.defaultUrl &&
    accountSettings.kidgerAppUrl &&
    accountSettings.shortUrl
  ) {
    console.log("All Required Settings provided");
    return true;
  } else {
    console.error("Check settings file");
    return false;
  }
}

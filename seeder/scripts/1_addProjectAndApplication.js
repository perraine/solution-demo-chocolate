"use strict";

const config = require("evt-config");
// globals
let cfg = {};
let scope = {};
let operator = {};

const EVT = require("evrythng-extended");

const projectTemplate = require("../templates/project.json");
const applicationTemplate = require("../templates/application.json");

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
  operator = new EVT.Operator(cfg.operatorKey);

  operator
    .project()
    .create(projectTemplate)
    .then(project => {
      project
        .application()
        .create(applicationTemplate)
        .then(application => {
          console.log("Project Id: ", project.id);
          console.log("Application Id", application.id);
          console.log("Application Key", application.appApiKey);
        })
        .catch(err => {
          console.log("App Create error", err);
        });
    })
    .catch(err => {
      console.log("Project Create error", err);
    });
}

function validSettings(accountSettings) {
  if (accountSettings.operatorKey && accountSettings.shortUrl) {
    console.log("All Required Settings provided");
    return true;
  } else {
    console.error("Check settings file");
    return false;
  }
}

// Demo Anti Counterfeit and COmmerciual Traceability Checker

"use strict";

const simulation = require("./modules/simulation.js");

function onActionCreated(event) {
  logger.info("Started Reactor");

  // invoked when 2 Factor authentication is Used
  if (event.action.type === "_Simulation") {
    simulation.run(app, event);
  }
}

module.exports = {
  onActionCreated
};

'use strict';

const addRuleToEvt = require('./modules/addRuleToEvt.js');
const REACTOR_FILE_NAME = '../reactor/supply-chain-bundle.zip';

const EVT = require('evrythng-extended');

const config = require('evt-config');
// globals
let cfg = {};

config
  .get('kidger-demo')
  .then(settings => {
    // now do my other stuff
    if (validSettings(settings)) {
      cfg = settings;
      loadData();
    }
  })
  .catch(err => {
    console.log('Error  : ', err);
  });

function loadData() {
  addRuleToEvt(
    cfg.apiUrl,
    cfg.operatorKey,
    cfg.projectId,
    cfg.applicationId,
    REACTOR_FILE_NAME
  )
    .then(function(resp) {
      console.log('Added Reactor to app : ' + cfg.applicationId);
    })
    .catch(err => {
      console.log('Error  : ', err);
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
    console.log('All Required Settings provided');
    return true;
  } else {
    console.error('Check settings file');
    return false;
  }
}

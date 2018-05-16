'use strict';

const config = require('evt-config');
// globals
let cfg = {};
let scope = {};
let operator = {};

const EVT = require('evrythng-extended');

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
  EVT.setup({
    apiUrl: cfg.apiUrl
  });
  operator = new EVT.Operator(cfg.operatorKey);

  // load list of products
  const newProducts = require('../templates/products.json');
  // set scope , so that products / thngs added to correct project

  scope = {
    params: {
      project: cfg.projectId
    }
  };

  newProducts.map(function(newProduct) {
    operator
      .product()
      .create(newProduct, scope)
      .then(function(product) {
        console.log('Created Product : ', product.id);
        // add thngs to product
        addRedirect(product.id, 'product');
        createThngs(product);
      })
      .catch(err => {
        console.log('Error adding Product to EVT: ', err);
      });
  });
}

function createThngs(product) {
  let thngs = require('../templates/thngs.json');
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
    newThng.name = product.name + ' - ' + newThng.customFields.state;
  } else {
    newThng.name = product.name;
  }

  operator
    .thng()
    .create(newThng, scope)
    .then(function(thng) {
      console.log('Thng Added', thng.id);
      addRedirect(thng.id, 'thng');
    })
    .catch(err => {
      console.log('Error adding thng to EVT: ', err);
    });
}
// should maybe use lodash, but doing the same shit anyway
function cloneObj(from) {
  return JSON.parse(JSON.stringify(from));
}

function addRedirect(objectId, objectType) {
  // no primary method for this, , use API
  EVT.api({
    method: 'POST',
    apiUrl: cfg.shortUrl,
    url: '/redirections',
    data: {
      defaultRedirectUrl: cfg.defaultUrl,
      type: objectType,
      evrythngId: objectId
    },
    authorization: cfg.operatorKey
  }).catch(err => {
    // consol e.log('err on creating redirect for Object : ' + objectId);
    console.log('Redirect Problem : ', err);
    console.log(objectId);
    console.log(objectType);
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

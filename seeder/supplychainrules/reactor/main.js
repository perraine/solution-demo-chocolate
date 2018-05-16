// Demo Anti Counterfeit and COmmerciual Traceability Checker

"use strict";

const _ = require("lodash");
const scanHistoryChecker = require("./modules/evt-scan-pattern-rule.js");

function onActionCreated(event) {
  logger.info("Started Reactor");

  app.$init.then(app => {
    // The scope is now ready for use.
    if (runRules(app, event)) {
      logger.info("Run Rules");

      // base counterfeit checks on product scans

      Promise.all([
        checkItemValidated(app, event),
        checkScanPatterns(app, event),
        checkItemLocation(app, event)
      ])
        .then(resp => {
          logger.info("All Checks Complete");
          done();
        })
        .catch(err => {
          logger.info("Error" + err);
          done();
        });
    }
    // invoked when 2 Factor authentication is Used
    if (event.action.type === "_CounterfeitScanningTwoFactorCheck") {
      Promise.all([check2FactorCode(app, event)])
        .then(resp => {
          logger.info("Checked 2 Factor Code");
          done();
        })
        .catch(err => {
          logger.info("Error 2 factor Code" + err);
          done();
        });
    } else {
      logger.info("2 Factor Rules Not Run");
    }
  });
}

module.exports = {
  onActionCreated
};

// This rule will check a valid code to make sure that it was scanned during
// production process (ie Activated)

function checkItemValidated(app, event) {
  return new Promise((resolve, reject) => {
    logger.info("COUNTERFEIT CHECK : Check Code Validated on the Line");
    // get the Thng scanned
    let thngScanned = event.action.thng;
    logger.info("thng scanned : " + thngScanned);
    // get the digital Identoity and check the calidated property
    app
      .thng(thngScanned)
      .read()
      .then(thng => {
        logger.info("THNG NAME : " + thng.name);
        resolve();
        if (thng.customFields) {
          if (thng.customFields.validated) {
            if (thng.customFields.validated === "true") {
              logger.info("Code Has been Validated on the Line");
              resolve();
            } else {
              logger.info("Code Has NOT been Validated on the Line");
              let actionType = "_CounterfeitScanningCodeNotValidated";
              thng
                .action(actionType)
                .create(useCurrentLocation(event, actionType))
                .then(s => {
                  logger.info("Record use of Non Validated Code");
                  resolve();
                })
                .catch(err => {
                  logger.info(
                    "Error Adding Counterfiet Activation Action" + err
                  );
                  resolve();
                });
            }
          } else {
            resolve();
          }
        }
      })
      .catch(err => {
        logger.error("Validated Code Error" + JSON.stringify(err));
        resolve();
      });
  });
}

// this rule is where we have asked the Customer to provide some additional
// information about the product. For example we know that we have data about
// the product (eg ts colour) so we can check that

function check2FactorCode(app, event) {
  return new Promise((resolve, reject) => {
    logger.info("COUNTERFEIT CHECK : Check 2 factor Code");
    if (event.action.customFields) {
      if (event.action.customFields.color) {
        logger.info("Color Field provided");
        // get the Product scanned
        let productScanned = event.action.product;
        logger.info("product scanned" + productScanned);
        app
          .product(productScanned)
          .read()
          .then(product => {
            logger.info("Product Found : " + product.name);
            logger.info("Product Color : " + product.customFields.color);
            logger.info("Product Found : " + product.name);
            if (product.customFields) {
              if (product.customFields.color) {
                if (
                  product.customFields.color === event.action.customFields.color
                ) {
                  logger.info("Code matches SKU Information");
                  resolve();
                } else {
                  logger.info("This code was not produced for this product");
                  let thngScanned = event.action.thng;
                  logger.info("thng scanned" + thngScanned);
                  let actionType = "_CounterfeitTwoFactorCheckFailed";
                  app
                    .thng(thngScanned)
                    .action(actionType)
                    .create(useCurrentLocation(event, actionType))
                    .then(act => {
                      logger.info("Added 2 Factor Check Action To Thng");
                      resolve();
                    });
                }
              } else {
                logger.info("Added 2 Factor Check Action To Thng");
                resolve();
              }
            }
          })
          .catch(err => {
            logger.error("2 Factor Code" + JSON.stringify(err));
            reject(err);
          });
      }
    }
  });
}

// This rule checks the scan location against other scans against this code

function checkScanPatterns(app, event) {
  return new Promise((resolve, reject) => {
    logger.info("COUNTERFEIT CHECK : Check Scan Patterns for this Code");
    scanHistoryChecker.validate(event.action.thng).then(resp => {
      logger.info("Scan Pattern resp : " + resp);
      resolve();
    });
  });
}

// This rule checks against the scanned location against the supply chain
// delivery location The simplest version expects an expected location on the
// digital identity, though we can also check, boxes / pallets and the production
// order itself

function checkItemLocation(app, event) {
  return new Promise((resolve, reject) => {
    logger.info(
      "COUNTERFEIT  / GREY MARKET CHECK : Check Code Location against expected Supply Chain Location"
    );
    let thngScanned = event.action.thng;
    logger.info("thng scanned" + thngScanned);
    // get the digital Identoity and check the calidated property
    app
      .thng(thngScanned)
      .read()
      .then(thng => {
        if (thng.customFields) {
          if (thng.customFields.destination) {
            if (
              thng.customFields.destination === event.action.context.countryCode
            ) {
              logger.info("Item is in desired country");
              resolve();
            } else {
              logger.info("Item scanned outside destined market");
              let actionType = "_OutOfMarket";
              thng
                .action(actionType)
                .create(useCurrentLocation(event, actionType))
                .then(s => {
                  logger.info("Record scan of code outside destined country");
                  resolve();
                });
            }
          } else {
            resolve();
          }
        }
      })
      .catch(err => {
        logger.error("Code Location Check" + JSON.stringify(err));
        reject(err);
      });
    resolve();
  });
}

// set the location of the actions so they dont show up as the Data Centre
function useCurrentLocation(event, actionType) {
  let actionContents = {};
  actionContents.locationSource = "sensor";
  actionContents.location = {};
  actionContents.location.position = event.action.location.position;
  actionContents.type = actionType;
  logger.info("Action Contents " + JSON.stringify(actionContents));
  return actionContents;
}

// If rules turned on, Run checks for all consumer scans
function runRules(app, event) {
  // set in app config
  if (app.customFields.runCounterfeitRules.toLowerCase() === "true") {
    let validScanTypes = [
      "scans",
      "_Offer",
      "_Reorder",
      "_Expired",
      "_Loyalty",
      "_CounterfeitScanningTwoFactorCheck",
      "_CounterfeitCheck",
      "_DivertedProductCheck",
      "_Registration"
    ];
    // run if a consumer or trade scan
    if (validScanTypes.indexOf(event.action.type) > -1) {
      return true;
    } else {
      logger.info("Action Type :" + event.action.type);
      return false;
    }
  } else {
    return false;
  }
}

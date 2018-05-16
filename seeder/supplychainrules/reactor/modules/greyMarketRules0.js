// grey market checker

'use strict';

// Essentially we are checking the history

function validate(app, event) {
  return new Promise((resolve, reject) => {
    logger.info('DIVERTED PRODUCT CHECK : Started');
    app
      .thng(event.action.thng)
      .read()
      .then(function(thng) {
        // Compare thng location with Action location
        if (typeof thng.customFields.destination === 'undefined') {
          logger.debug('No destination field set on the Item');
        } else {
          logger.debug('Check Location');
          var divertedThngAction = {};
          divertedThngAction.locationSource = 'sensor';
          divertedThngAction.location = {};
          divertedThngAction.location.position = event.action.location.position;
          if (
            thng.customFields.destination === event.action.context.countryCode
          ) {
            // Not Diverted product
            logger.debug('Is In Expected Market');
            divertedThngAction.type = '_InMarket';
            thng
              .action(divertedThngAction.type)
              .create(divertedThngAction)
              .then(function(scan) {
                logger.debug('scan : ' + JSON.stringify(scan));
                done();
              })
              .catch(err => {
                logger.debug(JSON.stringify(err));
                done();
              });
          } else {
            // Diverted product
            logger.debug('Is NOT in Expected Market');
            divertedThngAction.type = '_OutOfMarket';
            thng
              .action(divertedThngAction.type)
              .create(divertedThngAction)
              .then(function(scan) {
                logger.debug('scan : ' + JSON.stringify(scan));
                done();
              })
              .catch(err => {
                logger.debug(JSON.stringify(err));
                done();
              });
          }
        }
      })
      .catch(function(err) {
        logger.debug('Error' + err);
        done();
      });
    resolve(true);
  });
}

module.exports = {
  validate
};

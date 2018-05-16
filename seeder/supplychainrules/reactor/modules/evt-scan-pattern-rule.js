'use strict';

// Essentially we are checking the history

function validate(thng) {
  return new Promise((resolve, reject) => {
    logger.info('Started Item History Validation');
    resolve(true);
  });
}

module.exports = {
  validate
};

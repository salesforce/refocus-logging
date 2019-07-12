/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */
/**
 * src/handlerUtil.js
 * Kafka handler utilities
 */

const logger = require('pino')();

//error, warn, info
// debug or trace
const loggerTypes = {
  error: logger.error,
  warn: logger.warn,
  info: logger.info,
  debug: logger.debug,
  logger: logger.trace,
};

// The default handler just logs out the message
const defaultHandler = (messageSet, topic, partition, callback) => {
  let messageSetOutput = '';
  messageSet.forEach((m) => {
    const key = m.message.key;
    const value = m.message.value;

    // TODO: Discuss different cases and what should be done
    if (loggerTypes[key]) {
      logger.info('From application: ', topic, ' Message: ', value);
      callback('Logging with known key');
    } else {
      logger.info('From application: ', topic, ' Message: ', value);
      callback('Unknown key');
    }
  });
  return messageSetOutput;
};

/*
  Populate this as required
  FORMAT:
  {
    topic: () => {handler function},
  }
*/
const specialHandlers = () => ({

});

module.exports = {
  specialHandlers,
  defaultHandler,
};

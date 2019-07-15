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

// We need to retain the interal 'this' Pino uses
const loggerTypes = {
  error: logger.error.bind(logger),
  warn: logger.warn.bind(logger),
  info: logger.info.bind(logger),
  debug: logger.debug.bind(logger),
  trace: logger.trace.bind(logger),
};

// The default handler just logs out the message
const defaultHandler = (messageSet, topic, partition, callback = logger.info) => {
  messageSet.forEach((m) => {
    const key = m.message.key.toString(); // logging level
    const value = m.message.value.toString();

    // TODO: Discuss different cases and what should be done
    if (loggerTypes[key]) {
      loggerTypes[key]('From application: ', topic, ' Message: ', value,
      ' Received at: ', new Date());
    } else {
      callback('Logging with unknown key');
      logger.info('From application: ', topic, ' Message: ', value, 'Received at: ', new Date());
    }
  });
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

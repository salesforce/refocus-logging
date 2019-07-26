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

// jscs:disable requireShorthandArrowFunctions
const logger = require('pino')();
const bluebirdPromise = require('bluebird');

// We need to retain the interal 'this' Pino uses
const loggerTypes = {
  error: logger.error.bind(logger),
  warn: logger.warn.bind(logger),
  info: logger.info.bind(logger),
  debug: logger.debug.bind(logger),
  trace: logger.trace.bind(logger),
  verbose: logger.trace.bind(logger),
  silly: logger.trace.bind(logger),
};

// The default handler just logs out the message
const loggerHandler = (messageSet, topic, partition, callback = logger.info) => {
  return bluebirdPromise.each(messageSet, (m) => {
    let key;
    if (m.message.key) { // key is nullable
      key = m.message.key.toString(); // logging level
    }

    const value = JSON.parse(m.message.value.toString());
    const log = {
      application: topic,
      messageTime: value.messageTime,
      message: value.message,
    };
    if (loggerTypes[key]) {
      loggerTypes[key](log);
    } else {
      callback(`Received message with unknown key: ${key}`);
      logger.info(log);
    }
  });
};

module.exports = {
  loggerHandler,
};

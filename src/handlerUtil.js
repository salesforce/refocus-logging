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

/**
 * Handler triggered when a message is received on a topic
 * Logs out the message received on that topic.
 * @param {Array} messageSet - The set of messages that are received on this topic at each time
 * the handler is triggered
 * @param {String} topic - The topic in the Kafka Cluster
 * @param {int} partition - The partition of the KafkaCluster the message is received from
 * @param {callback} callback - The function to be executed when a message is received
 * with unknown level
 * @returns {bluebirdPromise} Resolved when the handler completes processing the message.
 * bluebirdPromise.each takes in an iterable and returns an array of promise
 */
const loggerHandler = (messageSet, topic, partition, callback = logger.info) => {
  return bluebirdPromise.each(messageSet, (m) => {
    try {
      const value = JSON.parse(m.message.value.toString());
      const level = value.level;
      const log = {
        application: topic,
        messageTime: value.messageTime,
        message: value.message,
      };
      if (loggerTypes[level]) {
        loggerTypes[level](log);
      } else {
        callback(`Received message with unknown level: ${level}`);
        logger.info(log);
      }
    } catch (err) {
      logger.error(`Could not parse message error: ${err}`);
    }
  });
};

module.exports = {
  loggerHandler,
};

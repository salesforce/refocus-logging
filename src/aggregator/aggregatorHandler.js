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
const {
  requestStartedHandler,
  publishedHandler,
  emittedHandler,
  acknowledgedHandler,
} = require('./utils');

const messageTypes = {
  requestStarted: requestStartedHandler,
  published: publishedHandler,
  emitted: emittedHandler,
  acknowledged: acknowledgedHandler,
};

/**
 * Handler triggered when a message is received on a topic
 * Logs out the message received on that topic.
 * @param {Array} messageSet - The set of messages that are received on this topic at each time
 * the handler is triggered
 * @param {String} topic - The topic in the Kafka Cluster
 * @param {int} partition - The partition of the KafkaCluster the message is received from
 */
const aggregationHandler = (messageSet, topic, partition) => {
  messageSet.forEach((m) => {
    try {
      // Not parsing the key on purpose, we want to keep it as a string
      // in order have it hash as a string and not as object
      // in our local map
      const key = m.message.key.toString();
      const value = JSON.parse(m.message.value.toString());
      const message = value.message;
      const type = message.type;
      messageTypes[type](message, key);
    } catch (err) {
      logger.error(`Could not parse message error: ${err}`);
    }
  });
};

module.exports = {
  aggregationHandler,
};

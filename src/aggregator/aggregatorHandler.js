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
const stats = require('stats-lite');
const persist = require('./persist').persist;
const { aggregatorTimeout, expectedEmits } = require('../config').getConfig();

/**
 * Key = JSON.stringify({
 *  updatedAt,
 *  name,
 * });
 */
const aggregateMap = new Map();

const flush = async (key) => {
  const {
    reqStartTime,
    jobStartTime,
    publishCompletedAt,
    numClientsEmittedTo,
    emittedAt,
    acknowledgedAt,
  } = aggregateMap.get(key);

  const queueTime = jobStartTime - reqStartTime;

  const isPublished = publishCompletedAt ? true : false;

  const publishLatency = publishCompletedAt - jobStartTime;

  const avgSubscribeLatency = Array.isArray(emittedAt) ?
    stats.mean(emittedAt.map(emitTime => emitTime - publishCompletedAt)) : null;

  const numSubsMissed = Array.isArray(emittedAt) ? expectedEmits - emittedAt.length : expectedEmits;

  const isSuccessfullyEmitted = numSubsMissed === 0 ? true : false;

  const numClientsAcknowledged = Array.isArray(acknowledgedAt) ?
    acknowledgedAt.length : 0;

  const endToEndLatency = Array.isArray(acknowledgedAt) ? acknowledgedAt.map(acknowledgeTime =>
    acknowledgeTime - jobStartTime) : [];

  const avgEndToEndLatency = stats.mean(endToEndLatency);
  const ninetyFifthPercentileEndToEndLatency = stats.percentile(endToEndLatency, 0.95);
  const medianEndToEndLatency = stats.median(endToEndLatency);

  const aggregatedVal = {
    jobStartTime,
    queueTime,
    publishLatency,
    avgSubscribeLatency,
    numSubsMissed,
    avgEndToEndLatency,
    medianEndToEndLatency,
    ninetyFifthPercentileEndToEndLatency,
    isPublished,
    isSuccessfullyEmitted,
    numClientsAcknowledged,
  };

  const parsedKey = JSON.parse(key);

  persist(parsedKey, aggregatedVal);
};

/**
 * message = {
 *  type,
 *  reqStartTime,
 *  jobStartTime
 * }
*/
const requestStartedHandler = (message, key) => {
  aggregateMap.set(key, {
    reqStartTime: message.reqStartTime,
    jobStartTime: message.jobStartTime,
  });
  setTimeout(() => {
    flush(key);
  }, aggregatorTimeout);
};

/**
 * message = {
 *  type,
 *  publishCompletedAt
 * }
*/
const publishedHandler = (message, key) => {
  if (aggregateMap.has(key)) {
    const { publishCompletedAt } = message;
    aggregateMap.get(key).publishCompletedAt = publishCompletedAt;
  }
};

/**
 * message = {
 *  type,
 *  emittedAt,
 *  numClientsEmittedTo
 * }
*/
const emittedHandler = (message, key) => {
  if (aggregateMap.has(key)) {
    const { emittedAt, numClientsEmittedTo } = message;
    const aggregateMapVal = aggregateMap.get(key);
    if (aggregateMapVal.emittedAt) {
      aggregateMapVal.emittedAt.push(emittedAt);
    } else {
      aggregateMapVal.emittedAt = [emittedAt];
    };

    aggregateMapVal.numClientsEmittedTo = aggregateMapVal.numClientsEmittedTo + numClientsEmittedTo;
  }
};

/**
 * message = {
 *  type,
 *  acknowledgedAt
 * }
*/
const acknowledgedHandler = (message, key) => {
  if (aggregateMap.has(key)) {
    const { acknowledgedAt } = message;
    const aggregateMapVal = aggregateMap.get(key);
    if (aggregateMapVal.acknowledgedAt) {
      aggregateMapVal.acknowledgedAt.push(acknowledgedAt);
    } else {
      aggregateMapVal.acknowledgedAt = [acknowledgedAt];
    };
  }
};

const messageTypes = {
  requestStarted: requestStartedHandler,
  published: publishedHandler,
  emitted: emittedHandler,
  acknowledged: acknowledgedHandler,
};

/**
 * Handler triggered when a message is received on a topic
 * Triggers the right type of handler among requestStartedHandler,
 * publishedHandler, emittedHandler, acknowledgedHandler based of type of message
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

const { aggregatorTimeout, expectedEmits } = require('../config').getConfig();
const percentile = require('percentile');

/**
 * Key = JSON.stringify({
 *  updatedAt,
 *  name,
 * });
 */
const aggregateMap = new Map();

const getAvg = (input) => {
  if (!Array.isArray(input)) {
    return;
  };

  const total = input.reduce((acc, c) => acc + c, 0);
  return total / input.length;
};

const flush = (key) => {
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
    getAvg(emittedAt.map(emitTime => emitTime - publishCompletedAt)) : -1;

  const numEmitted = Array.isArray(emittedAt) ? emittedAt.length : 0;

  const isSuccessfullyEmitted = numEmitted === expectedEmits ? true : false;

  const numClientsAcknowledged = Array.isArray(acknowledgedAt) ?
    acknowledgedAt.length : 0;

  const endToEndLatency = acknowledgedAt.map(acknowledgeTime =>
    acknowledgeTime - jobStartTime);

  const avgEndToEndLatency = getAvg(endToEndLatency);
  const medianEndToEndLatency = percentile(50, endToEndLatency);
  const ninetyFifthPercentile = percentile(95, endToEndLatency);

  const aggregatedVal = {
    queueTime,
    publishLatency,
    avgSubscribeLatency,
    numEmitted,
    avgEndToEndLatency,
    medianEndToEndLatency,
    ninetyFifthPercentile,
    isPublished,
    isSuccessfullyEmitted,
    numClientsAcknowledged,
  };

  const parsedKey = JSON.parse(key);
  logger.info('Key:', parsedKey, 'Value:', aggregatedVal);
};

/**
 * message = {
 *  type,
 *  reqStartTime,
 *  jobStartTime
 * }
*/
const requestStartedHandler = (message, key) => {
  aggregateMap.set(key, message);
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
    aggregateMapVal.emittedAt = aggregateMapVal.emittedAt ?
      aggregateMapVal.emittedAt.push(emittedAt) : [emittedAt];
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
    aggregateMapVal.acknowledgedAt = aggregateMapVal.acknowledgedAt ?
      aggregateMapVal.acknowledgedAt.push(acknowledgedAt) : [acknowledgedAt];
  }
};

module.exports = {
  requestStartedHandler,
  publishedHandler,
  emittedHandler,
  acknowledgedHandler,
  aggregateMap,
};

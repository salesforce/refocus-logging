const { aggregatorTimeout, expectedEmits } = require('../config').getConfig();

/**
 * Key = JSON.stringify({
 *  updatedAt,
 *  name,
 * });
 */
const aggregateMap = new Map();

const getAvg = (input) => {
  const total = input.reduce((acc, c) => acc + c, 0);
  return total / input.length;
};

const getMedian = input => {
  input.sort((a, b) => a - b);
  const lowMiddle = Math.floor((input.length - 1) / 2);
  const highMiddle = Math.ceil((input.length - 1) / 2);
  return ((input[lowMiddle] + input[highMiddle]) / 2);
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
      getAvg(emittedAt.map(emitTime => emitTime - publishCompletedAt)) : 'N/A';

    const numEmitted = Array.isArray(emittedAt) ? emittedAt.length : 0;

    const isSuccessfullyEmitted = numEmitted === expectedEmits ? true : false;

    const numClientsAcknowledged = Array.isArray(acknowledgedAt) ?
      acknowledgedAt.length : 0;

    const endToEndLatency = acknowledgedAt.map(acknowledgeTime =>
      acknowledgeTime - jobStartTime);

    const avgEndToEndLatency = getAvg(endToEndLatency);
    const mediaEndToEndLatency = getMedian(endToEndLatency);

    const aggregatedVal = {
      queueTime,
      publishLatency,
      avgSubscribeLatency,
      numEmitted,
      endToEndLatency,
      mediaEndToEndLatency,
      isPublished,
      isSuccessfullyEmitted,
      numClientsAcknowledged,
    };

    logger.info('Key:', key, 'Value:', aggregatedVal);

  }, aggregatorTimeout);
};

/**
 * message = {
 *  type,
 *  publishCompletedAt
 * }
*/
const publishedHandler = (message, key) => {
  const { publishCompletedAt } = message;
  aggregateMap.get(key).publishCompletedAt = publishCompletedAt;
};

/**
 * message = {
 *  type,
 *  emittedAt,
 *  numClientsEmittedTo
 * }
*/
const emittedHandler = (message, key) => {
  const { emittedAt, numClientsEmittedTo } = message;
  const aggregateMapVal = aggregateMap.get(key);
  aggregateMapVal.emittedAt = aggregateMapVal.emittedAt ?
    aggregateMapVal.emittedAt.push(emittedAt) : [emittedAt];
  aggregateMapVal.numClientsEmittedTo = aggregateMapVal.numClientsEmittedTo + numClientsEmittedTo;
};

/**
 * message = {
 *  type,
 *  acknowledgedAt
 * }
*/
const acknowledgedHandler = (message, key) => {
  const { acknowledgedAt } = message;
  const aggregateMapVal = aggregateMap.get(key);
  aggregateMapVal.acknowledgedAt = aggregateMapVal.acknowledgedAt ?
    aggregateMapVal.acknowledgedAt.push(acknowledgedAt) : [acknowledgedAt];
};

module.exports = {
  requestStartedHandler,
  publishedHandler,
  emittedHandler,
  acknowledgedHandler,
  aggregateMap,
};

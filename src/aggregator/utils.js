const logger = require('pino')();
const percentile = require('percentile');
const persist = require('./persist').persist;
const { aggregatorTimeout, expectedEmits } = require('../config').getConfig();

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

const getMedian = (input) => {
  if (!Array.isArray(input)) {
    return;
  };

  input.sort((a, b) => a - b);
  const lowMiddle = Math.floor((input.length - 1) / 2);
  const highMiddle = Math.ceil((input.length - 1) / 2);
  return ((input[lowMiddle] + input[highMiddle]) / 2);
};

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
    getAvg(emittedAt.map(emitTime => emitTime - publishCompletedAt)) : -1;

  const numSubsMissed = Array.isArray(emittedAt) ? expectedEmits - emittedAt.length : expectedEmits;

  const isSuccessfullyEmitted = numSubsMissed === 0 ? true : false;

  const numClientsAcknowledged = Array.isArray(acknowledgedAt) ?
    acknowledgedAt.length : 0;

  const endToEndLatency = Array.isArray(acknowledgedAt) ? acknowledgedAt.map(acknowledgeTime =>
    acknowledgeTime - jobStartTime) : [];

  const avgEndToEndLatency = getAvg(endToEndLatency);
  const ninetyFifthPercentileEndToEndLatency = percentile(95, endToEndLatency);
  const medianEndToEndLatency = getMedian(endToEndLatency);

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

module.exports = {
  requestStartedHandler,
  publishedHandler,
  emittedHandler,
  acknowledgedHandler,
  aggregateMap,
  flush,
  persist,
};

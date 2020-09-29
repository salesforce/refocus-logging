/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */
/**
 * src/config.js
 * define config variables
 */

const featureToggles = require('feature-toggles');
const pe = process.env;

/**
 * Return boolean true if the named environment variable is boolean true or
 * case-insensitive string 'true'.
 *
 * @param {Object} processEnv - The node process environment. (Passing it into
 *  this function instead of just getting a reference to it *inside* this
 *  function makes the function easier to test.)
 * @param {String} environmentVariableName - The name of the environment var.
 * @returns {Boolean} true if the named environment variable is boolean true or
 *  case-insensitive string 'true'.
 */
const environmentVariableTrue = (processEnv, environmentVariableName) => {
  const x = processEnv[environmentVariableName];
  return typeof x !== 'undefined' && x !== null &&
    x.toString().toLowerCase() === 'true';
};

const getMaxWaitTime = (input) => {
  const maxWait = +input;
  if (isNaN(maxWait) || maxWait <= 0) {
    return 100;
  }

  return maxWait;
};

const getMaxBytes = (input) => {
  const maxBytes = +input;
  if (isNaN(maxBytes) || maxBytes <= 0) {
    return 1024 * 1024;
  }

  return maxBytes;
};

const getIdleTimeout = (input) => {
  const idleTimeout = +input;
  if (isNaN(idleTimeout) || idleTimeout <= 0) {
    return 1000;
  }

  return idleTimeout;
};

const getAggregatorTimeout = (input) => {
  const aggregatorTimeout = +input;
  if (isNaN(aggregatorTimeout) || aggregatorTimeout <= 0) {
    return 30000;
  }

  return aggregatorTimeout;
};

const toTopicArray = (topics, prefix = '') => {
  if (!topics) return [];
  return topics.split(',')
    .filter(s => s && s.trim())
    .map(s => prefix + s.trim());
};

const pgdatabase = pe.PGDATABASE || 'aggregatedb';
const pguser = pe.PGUSER || 'postgres';
const pgpass = pe.PGPASS || 'postgres';
const pghost = pe.PGHOST || 'localhost';
const pgport = pe.PGPORT || 5432;
const defaultDbUrl = 'postgres://' + pguser + ':' + pgpass + '@' + pghost +
  ':' + pgport + '/' + pgdatabase;

const herokuConfig = {
  prefix: pe.KAFKA_PREFIX || '',
  aggregationTopic: toTopicArray(pe.AGGREGATION_TOPIC, pe.KAFKA_PREFIX),
  topics: toTopicArray(pe.TOPICS, pe.KAFKA_PREFIX),
  sslCert: pe.KAFKA_CLIENT_CERT || '.ssl/client.crt',
  sslKey: pe.KAFKA_CLIENT_CERT_KEY || '.ssl/client.key',
  connectionString: pe.KAFKA_URL ? pe.KAFKA_URL.replace(/\+ssl/g, '') : '',
  maxWaitTime: getMaxWaitTime(pe.KAFKA_CONSUMER_MAX_WAIT_TIME_MS),
  maxBytes: getMaxBytes(pe.KAFKA_CONSUMER_MAX_BYTES),
  idleTimeout: getIdleTimeout(pe.KAFKA_CONSUMER_IDLE_TIMEOUT),
  aggregatorTimeout: getAggregatorTimeout(pe.FLUSH_TO_PERSISTENCE_AFTER),
  expectedEmits: pe.NUM_REALTIME_PROCESSES || 3,
  dbUrl: pe.DATABASE_URL,
  aggregateTableName: pe.AGGREGATE_TABLE_NAME || 'aggregates',
};

const devConfig = {
  prefix: 'test-prefix',
  aggregationTopic: ['agg-foo'],
  topics: ['foo', 'bar'],
  sslCert: 'test-cert',
  sslKey: 'test-key',
  connectionString: 'test-url',
  maxWaitTime: 100,
  maxBytes: (1024 * 1024),
  idleTimeout: 1000,
  aggregatorTimeout: 30000,
  expectedEmits: 3,
  dbUrl: pe.DATABASE_URL || defaultDbUrl,
  aggregateTableName: 'aggregates',
};

const config = {
  development: devConfig,
  integration: herokuConfig,
  production: herokuConfig,
  staging: herokuConfig,
};

const toggles = {
  // Log the pub-sub stats
  logPubSubStats: environmentVariableTrue(pe, 'LOG_PUBSUB_STATS'),
}; // toggles

featureToggles.load(toggles);

module.exports = {
  getConfig: (environmentName) => {
    if (!environmentName) environmentName = pe.NODE_ENV;
    return config[environmentName] ? config[environmentName] : config.development;
  },

  testExport: {
    getMaxWaitTime,
    getMaxBytes,
    getIdleTimeout,
    herokuConfig,
    devConfig,
    toTopicArray,
  },
};

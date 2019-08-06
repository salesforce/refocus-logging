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

const toTopicArray = (topics, prefix = '') => {
  if (!topics) return [];
  return topics.split(',')
    .filter(s => s && s.trim())
    .map(s => prefix + s.trim());
};

const herokuConfig = {
  prefix: process.env.KAFKA_PREFIX,
  topics: toTopicArray(process.env.TOPICS, process.env.KAFKA_PREFIX),
  sslCert: process.env.KAFKA_CLIENT_CERT || '.ssl/client.crt',
  sslKey: process.env.KAFKA_CLIENT_CERT_KEY || '.ssl/client.key',
  connectionString: process.env.KAFKA_URL ? process.env.KAFKA_URL.replace(/\+ssl/g, '') : '',
  maxWaitTime: getMaxWaitTime(process.env.KAFKA_CONSUMER_MAX_WAIT_TIME_MS),
  maxBytes: getMaxBytes(process.env.KAFKA_CONSUMER_MAX_BYTES),
  idleTimeout: getIdleTimeout(process.env.KAFKA_CONSUMER_IDLE_TIMEOUT),
};

const devConfig = {
  prefix: 'test-prefix',
  topics: ['foo', 'bar'],
  sslCert: 'test-cert',
  sslKey: 'test-key',
  connectionString: 'test-url',
  maxWaitTime: 100,
  maxBytes: (1024 * 1024),
  idleTimeout: 1000,
};

const config = {
  development: devConfig,
  integration: herokuConfig,
  production: herokuConfig,
  staging: herokuConfig,
};

module.exports = {
  getConfig: (environmentName) => {
    if (!environmentName) environmentName = process.env.NODE_ENV;
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

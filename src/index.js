/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */
/**
 * src/index.js
 * intialize the consumer
 */

const debug = require('debug')('refocus-logging');
const consumer = require('./kafkaConsumer');
const logger = require('pino')();

debug(`Starting client consumer-${process.pid}`);

const errorHandler = (message) => {
  logger.error(message);
};

consumer.initAdmin().then(() => {
  consumer.initConsumer(errorHandler);
}).catch((error) => {
  logger.error(error);
});

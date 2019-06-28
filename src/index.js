/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */
const debug = require('debug')('refocus-logging');
const kafkaConsumer = require('./kafkaConsumer');
const logger = require('pino')();
const utils = require('./utils');

const clientId = 'consumer-' + process.pid;
debug(`Starting client ${clientId}`);

// As of now, for each topic, we are going to use the same handler, this might change in the future
// For each topic, start a subscription, that upon recieving
// a message executes the default handler method
let topic;
for (topic in kafkaConsumer.topicsHandlers) {
  const handler = utils.specialHandlers[topic] ? specialHandlers[topic] : defaultHandler;
  kafkaConsumer.topicsHandlers.topic(handler);
}

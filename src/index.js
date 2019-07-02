/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */
const debug = require('debug')('refocus-logging');
const kafkaConsumer = require('./kafkaConsumer');
const utils = require('./utils');
const logger = require('pino')();

debug(`Starting client ${clientId} consumer-${process.pid}`);

let topic;
const subscribe = () => {
  for (topic in kafkaConsumer.topicsHandlers) {
    const handler = utils.specialHandlers[topic] ? utils.specialHandlers[topic] :
      utils.defaultHandler;
    kafkaConsumer.topicsHandlers.topic(handler);
  }
};

// As of now, for each topic, we are going to use the same handler, this might change in the future
// For each topic, start a subscription, that upon recieving
// a message executes the default handler method
try {
  subscribe();
} catch (err) {
  logger.error(`Consumer could not subscribe to topic ${topic}, error: ${err}`);
}

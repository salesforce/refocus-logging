/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */
/**
 * src/kafkaConsumer.js
 * Define consumer logic for the Kafka
 * This starts up a consumer and subscribes to all topics
 */
const Kafka = require('no-kafka');
const handler = require('./handler');
const debug = require('debug')('refocus-logging');
const config = require('./config').getConfig();

const clientId = 'consumer-' + process.pid;

debug('The config is', config);

const initConsumer = (errorCallback) => {
  try {
    const consumer = new Kafka.SimpleConsumer({
      clientId,
      connectionString: config.connectionString,
      ssl: {
        cert: config.sslCert,
        key: config.sslKey,
      },
      maxWaitTime: config.maxWaitTime,
      maxBytes: config.maxBytes,
      idleTimeout: config.idleTimeout,
    });

    consumer.init();
    debug(`Kafka consumer ${clientId} has been started as ${consumer}`);

    // Construct an object that has a list of all topics as
    // keys and accordingly you can give it a handler
    const topicHandlers = config.topics.reduce((obj, topic) => {
      obj[topic] = (handler) => {
        try {
          consumer.subscribe(topic, handler);
        } catch (err) {
          errorCallback(`Unable to subscribe to topic ${topic}, error ${err}`);
        }
      };

      return obj;
    }, {});
    let topic;
    for (topic in topicHandlers) {
      topicHandlers[topic](handler(topic));
    }

    return {
      topicHandlers,
      consumer,
    };
  } catch (err) {
    errorCallback(`Unable to start consumer error: ${err}`);
  }
};

module.exports = {
  initConsumer,
};

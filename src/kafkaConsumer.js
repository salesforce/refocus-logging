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
const debug = require('debug')('refocus-logging');
const config = require('./config').getConfig();

const clientId = 'consumer-' + process.pid;

const defaultHandler = (messageSet, topic, partition, callback = logger.info) => {
  return Promise.each(messageSet, (m) => {
    const key = m.message.key.toString(); // logging level
    const value = JSON.parse(m.message.value.toString());
    const log = {
      application: topic,
      messageTime: value.messageTime,
      message: value.message,
    };
    if (loggerTypes[key]) {
      loggerTypes[key](log);
    } else {
      callback('Logging with unknown key');
      logger.info(log);
    }

    return consumer.commitOffset({ topic: topic,
      partition: partition,
      offset: m.offset,
      metadata: 'optional',
    });
  });
};

const initConsumer = async (errorCallback) => {
  try {
    const consumer = new Kafka.GroupConsumer({
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

    const strategies = [{
        subscriptions: ['kafka-test-topic'],
        handler: defaultHandler,
      },
    ];

    await consumer.init(strategies);


    // debug(`Kafka consumer ${clientId} has been started`);

    // // Construct an object that has a list of all topics as
    // // keys and accordingly you can give it a handler
    // const topicHandlers = config.topics.reduce((obj, topic) => {
    //   obj[topic] = async (handler) => {
    //     try {
    //       await consumer.subscribe(topic, handler);
    //     } catch (err) {
    //       errorCallback(`Unable to subscribe to topic ${topic}, error ${err}`);
    //     }
    //   };

    //   return obj;
    // }, {});
    // let topic;
    // for (topic in topicHandlers) {
    //   await topicHandlers[topic](handler(topic));
    // }

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

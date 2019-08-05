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
const loggerHandler = require('./handlerUtil').loggerHandler;
const clientId = 'consumer-' + process.pid;

/**
 * Only one instance in a consumer group handles a message belonging to its partition
 * Elected group leader will automatically assign partitions between all group members.
 * Each group is composed of many consumer instances for scalability and fault tolerance.
 * This is nothing more than publish-subscribe semantics where the
 * subscriber is a cluster of consumers instead of a single process.
*/
const initConsumer = async (errorCallback) => {
  try {
    const consumer = new Kafka.GroupConsumer({
      clientId,
      groupId: config.prefix + 'logger-group',
      connectionString: config.connectionString,
      ssl: {
        cert: config.sslCert,
        key: config.sslKey,
      },
      maxWaitTime: config.maxWaitTime,
      maxBytes: config.maxBytes,
      idleTimeout: config.idleTimeout,
    });

    const strategies = {
      subscriptions: config.topics,
      handler: loggerHandler,
    };

    await consumer.init(strategies);

    debug(`Kafka consumer ${clientId} has been started`);
  } catch (err) {
    errorCallback(`Unable to start consumer error: ${err}`);
  }
};

module.exports = {
  initConsumer,
};

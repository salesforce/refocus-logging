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
const bluebirdPromise = require('bluebird');

const clientId = 'group-consumer-1';

const initAdmin = () => {
  const admin = new Kafka.GroupAdmin();
  return admin.init().then(function () {
    return admin.listGroups().then(function (groups) {
      // [ { groupId: 'no-kafka-admin-test-group', protocolType: 'consumer' } ]
      return admin.describeGroup('logging-group').then(function (group) {
          return { error: null,
            groupId: 'logging-group',
            state: 'Stable',
            protocolType: 'consumer',
            protocol: 'DefaultAssignmentStrategy',
            members: [{
              memberId: 'group-consumer-1',
              clientId: 'group-consumer-1',
              clientHost: '/192.168.1.4',
              version: 0,
              subscriptions: ['cimarron-86176.ping'],
              memberAssignment: {
                    _blength: 44,
                    version: 0,
                    partitionAssignment: [{
                      topic: 'cimarron-86176.ping',
                      partitions: [0, 1, 2, 3, 4], },
                    ],
                    metadata: null,
                  },
            },
            ],
          };
        });
    });
  });
};

const dataHandler = function (messageSet, topic, partition) {
  return bluebirdPromise.each(messageSet, function (m) {
      console.log(topic, partition, m.offset, m.message.value.toString('utf8'));
      // commit offset
      return consumer.commitOffset({
        topic: topic, partition: partition, offset: m.offset, metadata: 'optional', });
    });
};

const initConsumer = async (errorCallback) => {
  try {
    const consumer = new Kafka.GroupConsumer({
      clientId,
      groupId: 'logging-group',
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
      subscriptions: ['cimarron-86176.ping'],
      handler: dataHandler,
    };

    await consumer.init(strategies);
  } catch (err) {
    errorCallback(err);
  }

  //   debug(`Kafka consumer ${clientId} has been started`);

  //   // Construct an object that has a list of all topics as
  //   // keys and accordingly you can give it a handler
  //   const topicHandlers = config.topics.reduce((obj, topic) => {
  //     obj[topic] = async (handler) => {
  //       try {
  //         await consumer.subscribe(topic, handler);
  //       } catch (err) {
  //         errorCallback(`Unable to subscribe to topic ${topic}, error ${err}`);
  //       }
  //     };

  //     return obj;
  //   }, {});
  //   let topic;
  //   for (topic in topicHandlers) {
  //     await topicHandlers[topic](handler(topic));
  //   }

  //   return {
  //     topicHandlers,
  //     consumer,
  //   };
  // } catch (err) {
  //   errorCallback(`Unable to start consumer error: ${err}`);
  // }
};

module.exports = {
  initAdmin,
  initConsumer,
};

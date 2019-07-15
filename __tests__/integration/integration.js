/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

const KafkaProducer = require('no-kafka');
const kafkaConsumer = require('../../src/kafkaConsumer');
const config = require('../../src/config')();

// Heroku
const producer = new KafkaProducer.Producer({
  connectionString: config.connectionString,
  ssl: {
    cert: config.sslCert,
    key: config.sslKey,
  },
});

producer.init();

const sendPing = async (key, value, topic) => producer.send({
  topic,
  partition: 0,
  message: {
    key,
    value: JSON.stringify(value),
  },
});

// TODO: Once we can enable setup Kafka on Heroku CI we would want to write
// this integration test. As of now, there is no documentation on how to do that
describe('test/integrtion/integration.test.js', () => {
  it('Should receive a message from producer', async () => {
    // const testTopic = config.topics[0];
    // await sendPing('key', 'value', testTopic);
    // const consumer = kafkaConsumer.initConsumer();
  });
});

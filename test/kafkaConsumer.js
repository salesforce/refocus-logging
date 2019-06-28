const chai = require('chai').expect;
const KafkaProducer = require('no-kafka');
const kafkaConsumer = require('../src/kafkaConsumer');
const logger = require('pino')();
const utils = require('../src/utils');
const sinon = require('sinon');

// Set up producer
// LOCALHOST...
// const producer = new KafkaProducer.Producer();

const config = utils.getConfig({
  TOPICS: 'test-topic',
  KAFKA_CLIENT_CERT: 'test-cert',
  KAFKA_CLIENT_CERT_KEY: 'test-key',
  KAFKA_URL: 'test-url',
});

// Heroku
const producer = new KafkaProducer.Producer({
  connectionString: config.connectionString,
  ssl: {
    cert: config.sslCert,
    key: config.sslKey,
  },
});

producer.init();

const producer = sinon.fake();

const sendPing = (key, value, topic) => producer.send({
  topic,
  partition: 0,
  message: {
    key,
    value: JSON.stringify(value),
  },
}).then((res) => logger.debug('kafkaProducer|Sent|%o', res));

describe('src/tests/consumer.js', () => {
  it('Should receive a message from producer', () => {
    const testTopic = utils.topics[0];
    sendPing('key', 'value', testTopic);
    const testHandler = (messageSet, topic, partition) => {
      messageSet.forEach((m) => {
        const key = m.message.key.toString();
        const value = JSON.parse(m.message.value.toString());
        expect(topic).to.equal(utils.testTopic);
        expect(key).to.equal('key');
        expect(value).to.equal('value');
      });
    };

    kafkaConsumer.topicsHandlers.testTopic(testHandler);
  });
});

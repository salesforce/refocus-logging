const chai = require('chai').expect;
const KafkaProducer = require('no-kafka');
const kafkaConsumer = require('../kafkaConsumer');
const logger = require('winston');
const utils = require('../utils');

// set up producer

// LOCALHOST...
// const producer = new KafkaProducer.Producer();

// Heroku
const producer = new KafkaProducer.Producer({
  connectionString: utils.connectionString,
  ssl: {
    cert: utils.sslCert,
    key: utils.sslKey,
  },
});

producer.init();

const sendPing = (key, value) => producer.send({
  topic: DEFAULT_TOPIC,
  partition: 0,
  message: {
    key,
    value: JSON.stringify(value),
  },
}).then((res) => logger.debug('kafkaProducer|Sent|%o', res));

sendPing('key', 'value');

describe('src/tests/consumer.js', () => {
  kafkaConsumer.testTopicHandler((messageSet, topic) => {
    messageSet.forEach((m) => {
      const key = m.message.key.toString();
      const value = JSON.parse(m.message.value.toString());
      expect(topic).to.equal(DEFAULT_TOPIC);
      expect(key).to.equal('key');
      expect(value).to.equal('value');
    });
  });
});


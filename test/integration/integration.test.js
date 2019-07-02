const KafkaProducer = require('no-kafka');
const kafkaConsumer = require('../../src/kafkaConsumer');
const logger = require('pino')();
const utils = require('../../src/utils');

const config = utils.getConfig(process.env);

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

describe('src/tests/consumer.js', () => {
  it('Should receive a message from producer', async () => {
    const testTopic = config.topics[0];
    await sendPing('key', 'value', testTopic);
    const testHandler = (messageSet, topic, partition) => {
      messageSet.forEach((m) => {
        const key = m.message.key.toString();
        const value = JSON.parse(m.message.value.toString());
        expect(topic).toEqual(testTopic);
        expect(key).toEqual('key');
        expect(value).toEqual('value');
      });
    };

    await kafkaConsumer.topicHandlers[testTopic](testHandler);
  });
});

const KafkaProducer = require('no-kafka');
const kafkaConsumer = require('../../src/kafkaConsumer');
const logger = require('pino')();
const handler = require('../../src/handler');
const config = require('../../src/config.env')();

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

describe('test/integrtion/integration.test.js', () => {
  it('Should receive a message from producer', async () => {
    const testTopic = config.topics[0];
    await sendPing('key', 'value', testTopic);
    kafkaConsumer.initConsumer();
  });
});

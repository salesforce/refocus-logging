const expect = require('chai').expect;
const KafkaProducer = require('no-kafka');
const utils = require('../src/utils');
const jest = require('jest');
const kafkaConsumer = require('../src/kafkaConsumer');
const kafka = require('no-kafka');

// check that create consumer is called by this function
const config = utils.getConfig({
  TOPICS: 'test',
  KAFKA_CLIENT_CERT: 'test-cert',
  KAFKA_CLIENT_CERT_KEY: 'test-key',
  KAFKA_URL: 'test-url',
  KAFKA_CONSUMER_MAX_WAIT_TIME_MS: 100,
  KAFKA_CONSUMER_MAX_BYTES: (1024 * 1024),
  KAFKA_CONSUMER_IDLE_TIMEOUT: 1000,
});

describe('src/tests/consumer.js', () => {
  console.error(jest.fn());
  kafka.SimpleConsumer = jest.fn(); // Mutate the export
  kafkaConsumer.topicsHandlers.test(utils.defaultHandler);
  it('Creates the consumer with the right arguments', () => {
    // TODO: Figure out a way to create a mock function out of new Kafka.SimpleConsumer
    // Do know how to solve it with Import and Export ES6 semantics, perhaps ask Ian
    // URL: https://stackoverflow.com/questions/40465047/how-can-i-mock-an-es6-module-import-using-jest
    // This tactic is super helpful for testing, struggled a lot with it in the past
    // expect new Kafka.SimpleConsumer was called with the arguments,
    jest.expect(kafka.SimpleConsumer).toHaveBeenCalledWith({
      clientId: `consumer-${process.pid}`,
      connectionString: 'test-url',
      ssl: {
        cert: 'test-cert',
        key: 'test-key',
      },
      maxWaitTime: 100,
      maxBytes: (1024 * 1024),
      idleTimeout: 1000,
    });
  });

  it('TopicHandlers gives you an object with mapping from topicName -> consumer.subscribe methods', () => {
    expect(kafkaConsumer.topicsHandlers).to.equal({
      test: 'something like a function',
    });
  });
});

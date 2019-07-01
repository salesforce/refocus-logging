const KafkaProducer = require('no-kafka');
const utils = require('../src/utils');
const kafkaConsumer = require('../src/kafkaConsumer');
const kafka = require('no-kafka');
jest.mock('no-kafka');

describe('src/tests/consumer.js', () => {
  it('TopicHandlers gives you an object with mapping from topicName -> function', () => {
    expect(kafkaConsumer.topicsHandler.foo).toBeInstanceOf(Function);
    expect(kafkaConsumer.topicsHandler.bar).toBeInstanceOf(Function);
  });

  kafkaConsumer.topicsHandler.foo(utils.defaultHandler);
  it('Creates the consumer with the right arguments', () => {
    const simpleConsumerMock = jest.spyOn(kafka, 'SimpleConsumer');
    expect(simpleConsumerMock).toHaveBeenCalledWith({
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
});

const handler = require('../../src/handler');
const kafkaConsumer = require('../../src/kafkaConsumer');
const kafka = require('no-kafka');
jest.mock('no-kafka');

describe('src/tests/consumer.js', () => {
  const topicHandlers = kafkaConsumer.initConsumer();
  it('TopicHandlers gives you an object with mapping from topicName -> function', () => {
    expect(topicHandlers.foo).toBeInstanceOf(Function);
    expect(topicHandlers.bar).toBeInstanceOf(Function);
  });

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

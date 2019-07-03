const kafkaConsumer = require('../../src/kafkaConsumer');
const kafka = require('no-kafka');
jest.mock('no-kafka');

describe('test/unit/consumer.js', () => {
  it('TopicHandlers gives you an object with mapping from topicName and throws no error', () => {
    const { topicHandlers } = kafkaConsumer.initConsumer();
    expect(topicHandlers.foo).toBeInstanceOf(Function);
    expect(topicHandlers.bar).toBeInstanceOf(Function);
  });

  it('subscribe throws an error', () => {
    const simpleConsumerMock = jest.spyOn(kafka, 'SimpleConsumer');
    simpleConsumerMock.mockImplementationOnce(() => ({
        subscribe: () => {
          throw new Error();
        },

        init: () => {
        },
      })
    );
    let output = '';
    console.error = jest.fn(inputs => (output += inputs));
    kafkaConsumer.initConsumer();
    expect(output).toBe('Unable to subscribe to topic foo, error Error' +
    'Unable to subscribe to topic bar, error Error');
  });

  it('Creates the consumer with the right arguments', () => {
    const topicHandlers = kafkaConsumer.initConsumer();
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

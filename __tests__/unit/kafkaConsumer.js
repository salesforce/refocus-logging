/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

const kafkaConsumer = require('../../src/kafkaConsumer');
const kafka = require('no-kafka');
jest.mock('no-kafka');

describe('test/unit/consumer.js', () => {
  it('TopicHandlers gives you an object with mapping from topicName and throws no error',
    async () => {
    const { topicHandlers } = await kafkaConsumer.initConsumer();
    expect(topicHandlers.foo).toBeInstanceOf(Function);
    expect(topicHandlers.bar).toBeInstanceOf(Function);
  });

  it('Creates the consumer with the right arguments', async () => {
    const simpleConsumerMock = jest.spyOn(kafka, 'SimpleConsumer');
    const topicHandlers = await kafkaConsumer.initConsumer();
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

  it('subscribe throws an error', async () => {
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
    const callback = jest.fn();
    await kafkaConsumer.initConsumer(callback);
    expect(callback).toHaveBeenCalled();
  });

  it('Init throws an error', async () => {
    const simpleConsumerMock = jest.spyOn(kafka, 'SimpleConsumer');
    simpleConsumerMock.mockImplementationOnce(() => ({
        subscribe: () => {
        },

        init: () => {
          throw new Error('');
        },
      })
    );
    const callback = jest.fn();
    await kafkaConsumer.initConsumer(callback);
    expect(callback).toHaveBeenCalled();
  });

});

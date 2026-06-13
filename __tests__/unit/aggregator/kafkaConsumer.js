/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

const kafkaConsumer = require('../../../src/kafkaConsumer');
const kafka = require('no-kafka');
jest.mock('no-kafka');

describe('test/unit/consumer.js', () => {
  it('Creates the consumer with the right arguments', async () => {
    const GroupConsumerMock = jest.spyOn(kafka, 'GroupConsumer');
    const topicHandlers = await kafkaConsumer.initConsumer();
    expect(GroupConsumerMock).toHaveBeenCalledWith(
      {
        clientId: `consumer-${process.pid}`,
        connectionString: 'test-url',
        groupId: 'test-prefixlogger-group',
        idleTimeout: 1000,
        maxBytes: 1048576,
        maxWaitTime: 100,
        ssl: {
          cert: 'test-cert',
          key: 'test-key',
        },
      });
  });

  it('Init throws an error', async () => {
    const GroupConsumerMock = jest.spyOn(kafka, 'GroupConsumer');
    GroupConsumerMock.mockImplementationOnce(() => ({
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

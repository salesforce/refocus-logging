/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

const { aggregationHandler } = require('../../../src/aggregator/aggregatorHandler');
const persist = require('../../../src/aggregator/persist');
const timeout = require('../../../src/config').getConfig().aggregatorTimeout;
jest.mock('../../../src/aggregator/persist');

jest.useFakeTimers();

describe('test/unit/aggregator/aggregatorHandler.js', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('end-to-end OK', () => {
    const key = Buffer.from(JSON.stringify({
      updatedAt: new Date().toISOString(),
      name: 'testSample',
    }));

    const reqStartTime = Date.now();
    const jobStartTime = reqStartTime + 2;
    const publishCompletedAt = jobStartTime + 4;
    const emittedAt1 = publishCompletedAt + 4;
    const emittedAt2 = publishCompletedAt + 6;
    const emittedAt3 = publishCompletedAt + 8;
    const numClientsEmittedTo = 2;
    const acknowledgedAt1 = emittedAt3 + 6;
    const acknowledgedAt2 = emittedAt2 + 4;

    const value1 = Buffer.from(JSON.stringify({ message:
      { type: 'requestStarted', reqStartTime, jobStartTime }, }));

    const value2 = Buffer.from(JSON.stringify({ message:
      { type: 'published', publishCompletedAt }, }));

    const value3 = Buffer.from(JSON.stringify({ message:
      { type: 'emitted', emittedAt: emittedAt1 }, }));

    const value4 = Buffer.from(JSON.stringify({ message:
      { type: 'emitted', emittedAt: emittedAt2 }, }));

    const value5 = Buffer.from(JSON.stringify({ message:
      { type: 'emitted', emittedAt: emittedAt3 }, }));

    const value6 = Buffer.from(JSON.stringify({ message:
      { type: 'acknowledged', acknowledgedAt: acknowledgedAt1 }, }));

    const value7 = Buffer.from(JSON.stringify({ message:
      { type: 'acknowledged', acknowledgedAt: acknowledgedAt2 }, }));

    const messageSet = [];

    messageSet.push({ message: { value: value1, key } });
    messageSet.push({ message: { value: value2, key } });
    messageSet.push({ message: { value: value3, key } });
    messageSet.push({ message: { value: value4, key } });
    messageSet.push({ message: { value: value5, key } });
    messageSet.push({ message: { value: value6, key } });
    messageSet.push({ message: { value: value7, key } });

    const result = {
      jobStartTime,
      queueTime: 2,
      publishLatency: 4,
      avgSubscribeLatency: 6,
      numSubsMissed: 0,
      avgEndToEndLatency: 16,
      medianEndToEndLatency: 16,
      ninetyFifthPercentileEndToEndLatency: 18,
      isPublished: true,
      isSuccessfullyEmitted: true,
      numClientsAcknowledged: 2,
    };

    const persistMock = jest.spyOn(persist, 'persist');
    aggregationHandler(messageSet, 'foo', 0);
    jest.advanceTimersByTime(timeout);
    expect(persistMock).toHaveBeenCalledWith(JSON.parse(key.toString()), result);
  });

  it('Does not include messages received after timeout', () => {
    const key = Buffer.from(JSON.stringify({
      updatedAt: new Date().toISOString(),
      name: 'testSample',
    }));

    const reqStartTime = Date.now();
    const jobStartTime = reqStartTime + 2;
    const publishCompletedAt = jobStartTime + 4;
    const emittedAt1 = publishCompletedAt + 4;
    const emittedAt2 = publishCompletedAt + 6;
    const emittedAt3 = publishCompletedAt + 8;
    const numClientsEmittedTo = 2;
    const acknowledgedAt1 = emittedAt3 + 6;
    const acknowledgedAt2 = emittedAt2 + 4;

    const value1 = Buffer.from(JSON.stringify({ message:
      { type: 'requestStarted', reqStartTime, jobStartTime }, }));

    const value2 = Buffer.from(JSON.stringify({ message:
      { type: 'published', publishCompletedAt }, }));

    const value3 = Buffer.from(JSON.stringify({ message:
      { type: 'emitted', emittedAt: emittedAt1 }, }));

    const value4 = Buffer.from(JSON.stringify({ message:
      { type: 'emitted', emittedAt: emittedAt2 }, }));

    const value5 = Buffer.from(JSON.stringify({ message:
      { type: 'emitted', emittedAt: emittedAt3 }, }));

    const value6 = Buffer.from(JSON.stringify({ message:
      { type: 'acknowledged', acknowledgedAt: acknowledgedAt1 }, }));

    const value7 = Buffer.from(JSON.stringify({ message:
      { type: 'acknowledged', acknowledgedAt: acknowledgedAt2 }, }));

    const messageSet = [];

    messageSet.push({ message: { value: value1, key } });
    messageSet.push({ message: { value: value2, key } });
    messageSet.push({ message: { value: value3, key } });
    messageSet.push({ message: { value: value4, key } });

    const result = {
      jobStartTime,
      queueTime: 2,
      publishLatency: 4,
      avgSubscribeLatency: 5,
      numSubsMissed: 1,
      avgEndToEndLatency: NaN,
      medianEndToEndLatency: NaN,
      ninetyFifthPercentileEndToEndLatency: NaN,
      isPublished: true,
      isSuccessfullyEmitted: false,
      numClientsAcknowledged: 0,
    };
    const persistMock = jest.spyOn(persist, 'persist');
    aggregationHandler(messageSet, 'foo', 0);
    jest.advanceTimersByTime(timeout);

    const messageSet2 = [];

    messageSet2.push({ message: { value: value5, key } });
    messageSet2.push({ message: { value: value6, key } });
    messageSet2.push({ message: { value: value7, key } });
    aggregationHandler(messageSet2, 'foo', 0);
    jest.advanceTimersByTime(timeout);
    expect(persistMock).toHaveBeenCalledWith(JSON.parse(key.toString()), result);
    expect(persistMock).toHaveBeenCalledTimes(1);
  });
});

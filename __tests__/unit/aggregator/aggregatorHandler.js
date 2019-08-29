/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

const { aggregationHandler } = require('../../../src/aggregator/aggregatorHandler');
const utils = require('../../../src/aggregator/utils');
jest.mock('../../../src/aggregator/utils');

describe('test/unit/aggregator/aggregatorHandler.js', () => {
  it('Calls the right handler', () => {
    const key = Buffer.from(JSON.stringify({
      updatedAt: new Date().toISOString(),
      name: 'testSample',
    }));

    const value = Buffer.from(JSON.stringify({ message:
      { type: 'requestStarted' }, level: 'level', messageTime: new Date(), }));
    const messageSet = [{ message: { value, key } }];
    const requestStartedHandlerMock = jest.spyOn(utils, 'requestStartedHandler');
    aggregationHandler(messageSet, 'foo', 0);
    expect(requestStartedHandlerMock).nthCalledWith(1,
      { type: 'requestStarted' }, key.toString()
    );
  });

  it('Logs for existing key', () => {
  });
});

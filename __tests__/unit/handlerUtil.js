/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

const { defaultHandler, specialHandlers } = require('../../src/handlerUtil');

describe('test/unit/handler.js', () => {
  it('Returns an empty object', () => {
    expect(specialHandlers()).toEqual({});
  });

  it('Logs for unknown key', () => {
    const messageSet = [{ message: { key: 'key', value: 'value' } }];
    const callback = jest.fn();
    defaultHandler(messageSet, 'foo', 0, callback);
    expect(callback).toHaveBeenCalledWith('Logging with unknown key');
  });

  it('Logs for existing key', () => {
    const messageSet = [{ message: { key: 'info', value: 'value' } }];
    const callback = jest.fn();
    defaultHandler(messageSet, 'foo', 0, callback);
    expect(callback).toHaveBeenCalledWith('Logging with known key');
  });
});

/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

const { loggerHandler } = require('../../src/handlerUtil');

describe('test/unit/handlerUtil.js', () => {
  it('Logs for unknown key', async () => {
    const value = Buffer.from(JSON.stringify({ message: { foo: 'bar' }, level: 'level',
      messageTime: new Date(), }));
    const messageSet = [{ message: { value } }];
    const callback = jest.fn();
    await loggerHandler(messageSet, 'foo', 0, callback);
    expect(callback).toHaveBeenCalledWith('Received message with unknown level: level');
  });

  it('Logs for existing key', async () => {
    const value = Buffer.from(JSON.stringify({ message: { foo: 'bar' }, level: 'info',
      messageTime: new Date(), }));
    const messageSet = [{ message: { value } }];
    const callback = jest.fn();
    await loggerHandler(messageSet, 'foo', 0, callback);
    expect(callback).not.toHaveBeenCalled();
  });
});

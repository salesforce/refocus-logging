/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

const handler = require('../../src/handler');
const handlerUtil = require('../../src/handlerUtil');

describe('test/unit/handler.js', () => {
  it('Does not call the default handler and calls the special handler', () => {
    const specialHandlerMock = jest.spyOn(handlerUtil, 'specialHandlers');
    const defaultHandlerMock = jest.spyOn(handlerUtil, 'defaultHandler');
    const specialHandler = jest.fn();
    specialHandlerMock.mockImplementation(() => ({
      foo: specialHandler,
    }));
    handler('foo')();
    expect(specialHandler).toHaveBeenCalled();
    expect(defaultHandlerMock).not.toHaveBeenCalled();
  });

  it('Does not call the special handler and call the default handler', () => {
    const specialHandlerMock = jest.spyOn(handlerUtil, 'specialHandlers');
    const defaultHandlerMock = jest.spyOn(handlerUtil, 'defaultHandler');
    const specialHandler = jest.fn();
    specialHandlerMock.mockImplementation(() => ({
      foo: specialHandler,
    }));
    defaultHandlerMock.mockImplementation(() => {});
    handler('bar')();
    expect(specialHandler).not.toHaveBeenCalled();
    expect(defaultHandlerMock).toHaveBeenCalled();
  });
});

const handler = require('../../src/handler');
const handlerUtil = require('../../src/handlerUtil');

describe('test/unit/consumer.js', () => {
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

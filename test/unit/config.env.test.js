/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

const configTest = require('../../src/config.env').testExport;

describe('test/unit/config.env.js', () => {
  it('Returns 100 for null, undefined, 0, negative and string values', () => {
    const resultNull = configTest.getMaxWaitTime(null);
    const resultUndefined = configTest.getMaxWaitTime(undefined);
    const resultZero = configTest.getMaxWaitTime(0);
    const resultNegative = configTest.getMaxWaitTime(-1);
    const resultString = configTest.getMaxWaitTime('foo');
    expect(resultNull).toBe(100);
    expect(resultNegative).toBe(100);
    expect(resultUndefined).toBe(100);
    expect(resultZero).toBe(100);
    expect(resultString).toBe(100);
  });

  it('Does not call the special handler and call the default handler', () => {

  });
});
